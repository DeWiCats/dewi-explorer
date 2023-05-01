import { JsonMetadata, Metadata, Metaplex } from "@metaplex-foundation/js";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SYSVAR_CLOCK_PUBKEY,
  SystemProgram,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import {
  init as initVoterStakeRegistry,
  PROGRAM_ID as VoterStakeRegistryProgramId,
  registrarKey,
  positionKey,
} from "@helium/voter-stake-registry-sdk";
import { HNT_MINT, toNumber } from "@helium/spl-utils";
import axios from "axios";
import {
  BN,
  AnchorProvider,
  Program,
  IdlAccounts,
  IdlTypes,
} from "@coral-xyz/anchor";
import {
  PROGRAM_ID,
  EPOCH_LENGTH,
  init,
  delegatedPositionKey,
} from "@helium/helium-sub-daos-sdk";
import { VoterStakeRegistry as HeliumVoterStakeRegistry } from "@helium/idls/lib/types/voter_stake_registry";
import {
  createTransferCheckedInstruction,
  getAssociatedTokenAddress,
  getOrCreateAssociatedTokenAccount,
} from "@solana/spl-token";

const DEWICATS_TREASURY = new PublicKey(
  "J1FDGsKRHfVZdnHhkcmfauDd3eFHjkF6AJ69DQQ7QiGi"
);

const subDaos = {
  mobile: "Gm9xDCJawDEKDrrQW6haw94gABaYzQwCq4ZQU8h8bd22",
  iot: "39Lw1RH6zt8AJvKn3BTxmUDofzduCM2J3kSaGDZ8L7Sk",
} as Record<string, string>;

export type Lockup = IdlTypes<HeliumVoterStakeRegistry>["Lockup"];
export type LockupKind = IdlTypes<HeliumVoterStakeRegistry>["LockupKind"];
export type PositionV0 = IdlAccounts<HeliumVoterStakeRegistry>["positionV0"];
export type VotingMintConfig =
  IdlTypes<HeliumVoterStakeRegistry>["VotingMintConfigV0"];
export interface Position extends Omit<PositionV0, "lockup"> {
  lockup: Lockup;
}
type RegistrarV0 = IdlAccounts<HeliumVoterStakeRegistry>["registrar"];
export interface Registrar extends RegistrarV0 {
  votingMints: VotingMintConfig[];
}
const govProgramId = new PublicKey(
  "hgovkRU6Ghe1Qoyb54HdSLdqN7VtxaifBzRmh9jtd3S"
);

export function chunks<T>(array: T[], size: number): T[][] {
  const result: Array<T[]> = [];
  let i, j;
  for (i = 0, j = array.length; i < j; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

export const calcMultiplier = ({
  baselineScaledFactor,
  maxExtraLockupScaledFactor,
  lockupSecs,
  lockupSaturationSecs,
}: {
  baselineScaledFactor: number;
  maxExtraLockupScaledFactor: number;
  lockupSecs: number;
  lockupSaturationSecs: number;
}): number => {
  let multiplier = 0;
  const base = baselineScaledFactor !== 0 ? baselineScaledFactor : 1e9;

  multiplier =
    (Math.min(lockupSecs / lockupSaturationSecs, 1) *
      maxExtraLockupScaledFactor) /
    base;

  return multiplier;
};

export const calcPositionVotingPower = ({
  position,
  registrar,
  unixNow,
}: {
  position: Position | null;
  registrar: Registrar | null;
  unixNow: BN;
}) => {
  let votingPower = new BN(0);
  const mintCfgs = registrar?.votingMints || [];
  const mintCfg = position ? mintCfgs[position.votingMintConfigIdx] : undefined;

  if (position && mintCfg) {
    const {
      lockupSaturationSecs,
      baselineVoteWeightScaledFactor,
      maxExtraLockupVoteWeightScaledFactor,
      genesisVotePowerMultiplier = 1,
    } = mintCfg as VotingMintConfig;
    const hasGenesisMultiplier = position.genesisEnd.gt(unixNow);
    const lockup = position!.lockup;
    const lockupKind = Object.keys(lockup.kind as LockupKind)[0];
    const currTs = lockupKind === "constant" ? lockup.startTs : unixNow;
    const lockupSecs = lockup.endTs.sub(currTs).toNumber();
    const amountLockedNative = position!.amountDepositedNative;
    const baselineScaledFactorNum = baselineVoteWeightScaledFactor.toNumber();
    const maxExtraLockupVoteWeightScaledFactorNum =
      maxExtraLockupVoteWeightScaledFactor.toNumber();
    const lockupSaturationSecsNum = lockupSaturationSecs.toNumber();

    const multiplier =
      (hasGenesisMultiplier ? genesisVotePowerMultiplier : 1) *
      calcMultiplier({
        baselineScaledFactor: baselineScaledFactorNum,
        maxExtraLockupScaledFactor: maxExtraLockupVoteWeightScaledFactorNum,
        lockupSecs,
        lockupSaturationSecs: lockupSaturationSecsNum,
      });

    votingPower = amountLockedNative.muln(multiplier);
  }

  return votingPower;
};

export const registrarCollectionKey = (registrar: PublicKey) =>
  PublicKey.findProgramAddressSync(
    [Buffer.from("collection", "utf-8"), registrar.toBuffer()],
    VoterStakeRegistryProgramId
  );

export const getVeHNT = async (
  pubKey: PublicKey,
  metaplex: Metaplex,
  subDAO: string,
  anchorProvider: AnchorProvider
) => {
  const connection = metaplex.connection;
  const realmHNT = PublicKey.findProgramAddressSync(
    [Buffer.from("governance", "utf-8"), Buffer.from("Helium", "utf-8")],
    govProgramId
  )[0];

  const hntRegistrarKey = registrarKey(realmHNT, HNT_MINT);

  // veHNT Collecion ID
  const hntRegistrarCollectionKey = registrarCollectionKey(hntRegistrarKey[0]);

  const heliumNFTs = [hntRegistrarCollectionKey[0].toBase58()];

  const collectables = (await metaplex
    .nfts()
    .findAllByOwner({ owner: pubKey })) as Metadata<JsonMetadata<string>>[];

  const veHNTCollectables = collectables.filter((c) =>
    heliumNFTs.includes(c.collection?.address.toBase58() || "")
  );

  const posKeys = veHNTCollectables.map(
    (nft) => positionKey((nft as any).mintAddress)[0]
  );

  const positionAccInfos = (
    await Promise.all(
      chunks(posKeys, 99).map((chunk) =>
        connection.getMultipleAccountsInfo(chunk)
      )
    )
  ).flat();

  const delegatedPosKeys = posKeys.map(
    (posKey) => delegatedPositionKey(posKey)[0]
  );

  const delegatedPositionAccs = await (async () => {
    const idl = await Program.fetchIdl(PROGRAM_ID, anchorProvider);
    const hsdProgram = await init(anchorProvider as any, PROGRAM_ID, idl);

    return (
      await Promise.all(
        chunks(delegatedPosKeys, 99).map((chunk) =>
          connection.getMultipleAccountsInfo(chunk)
        )
      )
    )
      .flat()
      .map((delegatedPos) =>
        delegatedPos
          ? hsdProgram.coder.accounts.decode(
              "DelegatedPositionV0",
              delegatedPos.data
            )
          : null
      );
  })();

  const client = await initVoterStakeRegistry(anchorProvider as any);

  const registrar = (await client.account.registrar.fetch(
    hntRegistrarKey[0]
  )) as Registrar;

  const clock = await connection.getAccountInfo(SYSVAR_CLOCK_PUBKEY);

  const now = new BN(Number(clock!.data.readBigInt64LE(8 * 4)));

  const positionVotingPowerArr = positionAccInfos.map((posAccInfo, idx) => {
    const pos = client.coder.accounts.decode(
      "PositionV0",
      posAccInfo!.data
    ) as PositionV0;

    const isDelegated = !!delegatedPositionAccs[idx];

    const delegatedSubDao = isDelegated
      ? delegatedPositionAccs[idx]?.subDao
      : null;

    const hasGenesisMultiplier = pos.genesisEnd.gt(now);

    // Calculate voting power for position
    // const posVotingPower = calcPositionVotingPower({
    //   position: pos,
    //   registrar,
    //   unixNow: now,
    // });

    const amountDeposited = pos!.amountDepositedNative;

    if (subDaos[subDAO] === delegatedSubDao.toBase58()) {
      return {
        total: toNumber(amountDeposited, 8),
        totalWithMult:
          toNumber(amountDeposited, 8) * (hasGenesisMultiplier ? 3 : 1),
      };
    }

    return {
      total: 0,
      totalWithMult: 0,
    };
  });

  // Loop through collectables and calculate total amount deposited
  //   const allMetadata = await Promise.all(
  //     veHNTCollectables.map(async (c) => {
  //       const { data } = await axios(c.uri);
  //       const amountDepositedAttribute = data.attributes.find(
  //         (a: any) => a.trait_type === "amount_deposited"
  //       );
  //       const amountDepositedValue = amountDepositedAttribute.value;
  //       return amountDepositedValue;
  //     })
  //   );

  const totalAmountDeposited = positionVotingPowerArr.reduce(
    (a, b) => a + b.total,
    0
  );

  const totalAmountDepositedWithMult = positionVotingPowerArr.reduce(
    (a, b) => a + b.totalWithMult,
    0
  );

  return { totalAmountDeposited, totalAmountDepositedWithMult };
};

export const createTransferSolTxn = async (
  anchorProvider: AnchorProvider,
  amount: number
) => {
  const payer = anchorProvider.publicKey;

  const amountInLamports = LAMPORTS_PER_SOL * amount;

  const transferIxn = SystemProgram.transfer({
    fromPubkey: payer,
    toPubkey: DEWICATS_TREASURY,
    lamports: amountInLamports,
  });

  const { blockhash } = await anchorProvider.connection.getLatestBlockhash();

  const messageV0 = new TransactionMessage({
    payerKey: payer,
    recentBlockhash: blockhash,
    instructions: [transferIxn],
  }).compileToV0Message();

  return new VersionedTransaction(messageV0);
};

export const createTransferTxn = async (
  anchorProvider: AnchorProvider,
  amount: number,
  decimals: number,
  mintAddress: string
) => {
  const payer = anchorProvider.publicKey;

  const mint = new PublicKey(mintAddress);

  const payerATA = await getAssociatedTokenAddress(mint, payer);

  const treasuryATA = await getAssociatedTokenAddress(mint, DEWICATS_TREASURY);

  const actualAmt = amount * Math.pow(10, decimals);

  const transferCheckedIxn = createTransferCheckedInstruction(
    payerATA,
    mint,
    treasuryATA,
    payer,
    actualAmt,
    decimals,
    [payer]
  );

  const { blockhash } = await anchorProvider.connection.getLatestBlockhash();

  const messageV0 = new TransactionMessage({
    payerKey: payer,
    recentBlockhash: blockhash,
    instructions: [transferCheckedIxn],
  }).compileToV0Message();

  return new VersionedTransaction(messageV0);
};
