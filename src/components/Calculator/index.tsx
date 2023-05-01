import React, { useCallback, useEffect, useMemo } from "react";
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Fade,
  MenuItem,
  OutlinedInputProps,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputBase from "@mui/material/InputBase";
import Image from "next/image";
import { TypeAnimation } from "react-type-animation";
import useHeliumSolana from "@/hooks/useHeliumSolana";
import { toNumber } from "@helium/spl-utils";
import dynamic from "next/dynamic";
import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import { Connection } from "@solana/web3.js";
import { useAsync } from "react-async-hook";
import { getVeHNT } from "@/utils/solanaUtils";
import { AnchorProvider } from "@coral-xyz/anchor";
import getConfig from "next/config";

const {
  publicRuntimeConfig: { HELIUS_API_KEY },
} = getConfig();

const WalletMultiButton = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(
      (module) => module.WalletMultiButton
    ),
  { ssr: false }
);

const WalletDisconnectButton = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(
      (module) => module.WalletDisconnectButton
    ),
  { ssr: false }
);

const CustomCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  padding: theme.spacing(4),
  borderRadius: theme.spacing(4),
  gap: theme.spacing(2),
  height: "600px",
  width: "350px",
}));

const CustomButton = styled(Button)(({ theme }) => ({
  color: "black",
  fontSize: "20px",
  fontFamily: "DMSans-Medium",
  textTransform: "none",
  height: "50px",
  borderRadius: "25px",
  backgroundColor: "white",
  "&:disabled": {
    backgroundColor: "#242424",
    color: "#666666",
  },
  "&:hover": {
    backgroundColor: "white",
  },
}));

const CustomTextField = styled(TextField)(({ theme }) => ({
  "&.MuiInputBase-root": {
    backgroundColor: "transparent",
  },
  "& .MuiFilledInput-root": {
    overflow: "hidden",
    borderRadius: theme.spacing(2),
    backgroundColor: "#303030",
    fontSize: 16,

    "&.Mui-focused": {
      color: "white",
    },
    "&:hover:not(.Mui-disabled)": {
      backgroundColor: "#303030",
    },
  },
  "& .MuiFormLabel-root.Mui-focused": {
    color: "white",
  },
  input: {
    "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
      "-webkit-appearance": "none",
      display: "none",
    },
  },
}));

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  "label + &": {
    marginTop: theme.spacing(3),
  },
  "& .MuiInputBase-input": {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: theme.spacing(1),
    overflow: "hidden",
    borderRadius: theme.spacing(2),
    backgroundColor: "#303030",
    fontSize: 16,
    padding: theme.spacing(2),

    "&.Mui-focused": {
      color: "white",
    },
    "&:hover:not(.Mui-disabled)": {
      backgroundColor: "#303030",
    },

    // Use the system font instead of the default Roboto font.
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    "&:focus": {
      borderRadius: theme.spacing(2),
      borderColor: "#fcfcfc9a",
      boxShadow: "0 0 0 0.2rem #fcfcfc9a",
    },
  },
}));

const CustomMenuItem = styled(MenuItem)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  gap: theme.spacing(1),

  "&:hover": {
    backgroundColor: "#303030",
  },
  "&.Mui-selected": {
    backgroundColor: "#ffffff1a",
  },
  "&.Mui-selected:hover": {
    backgroundColor: "#ffffff1a",
  },
}));

const LoadingImage = styled(Image)({
  cursor: "pointer",
  background: "#E1C4F5",
  border: "1px solid #E1C4F52A",
  borderRadius: "50%",
});

const ImageWrapper = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const CardInnerContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  flex: 1,
}));

const CalculatedContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(2),
  flex: 1,
}));

const CalculateformBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
}));

type CustomSelectProps = {
  value: string;
  onChange: (event: { target: { value: string } }) => void;
};

const CustomSelect = ({ value, onChange }: CustomSelectProps) => {
  return (
    <Select value={value} onChange={onChange} input={<BootstrapInput />}>
      <CustomMenuItem value="iot">
        <Image alt="iot" src="/images/iotIcon.svg" width={20} height={20} />
        {"IOT"}
      </CustomMenuItem>
      <CustomMenuItem value="mobile">
        <Image
          alt="mobile"
          src="/images/mobileIcon.svg"
          width={20}
          height={20}
        />
        {"MOBILE"}
      </CustomMenuItem>
    </Select>
  );
};

// https://github.com/helium/helium-program-library/blob/master/packages/helium-admin-cli/emissions/iot.json
// https://github.com/helium/helium-program-library/blob/master/packages/helium-admin-cli/emissions/mobile.json
const dailyEmissions = {
  iot: [
    {
      startTime: "2023-04-18T00:00:00Z",
      emissionsPerEpoch: "165,616,438.356164",
    },
    {
      startTime: "2023-08-01T00:00:00Z",
      emissionsPerEpoch: "82,581,967.213115",
    },
    {
      startTime: "2024-08-01T00:00:00Z",
      emissionsPerEpoch: "82,808,219.178082",
    },
  ],
  mobile: [
    {
      startTime: "2023-04-18T00:00:00Z",
      emissionsPerEpoch: "108,493,150.684932",
    },
    {
      startTime: "2023-08-01T00:00:00Z",
      emissionsPerEpoch: "54,098,360.655738",
    },
    {
      startTime: "2024-08-01T00:00:00Z",
      emissionsPerEpoch: "54,246,575.342466",
    },
  ],
} as Record<string, Array<{ startTime: string; emissionsPerEpoch: string }>>;

type CalculatedMessageProps = {
  subDAO: string;
  estimatedRewards: number;
};

const CalculatedMessage = ({
  subDAO,
  estimatedRewards,
}: CalculatedMessageProps) => {
  return (
    <Fade in timeout={1000}>
      <CalculatedContainer>
        <ImageWrapper>
          <LoadingImage
            alt="loading"
            src="/images/whiskerAssistant.png"
            width={120}
            height={120}
          />
        </ImageWrapper>
        <TypeAnimation
          sequence={[
            "According to my catculations... 🐱",
            1000, // Waits 1s
            `Your expected reward is ${estimatedRewards.toLocaleString()} ${subDAO}`,
            () => {
              //   console.log("Sequence completed"); // Place optional callbacks anywhere in the array
            },
          ]}
          wrapper="span"
          cursor={true}
          omitDeletionAnimation
          speed={60}
          style={{ fontSize: "16px", display: "inline-block" }}
        />
      </CalculatedContainer>
    </Fade>
  );
};

type CalculateFormProps = {
  subDAO: string;
  onSubDAOChanged: (event: { target: { value: string } }) => void;
  yourVeHNT: string | undefined;
  onVeHNTChanged: (event: React.ChangeEvent<HTMLInputElement>) => void;
  walletConnected: boolean;
};

const CalculateForm = ({
  subDAO,
  onSubDAOChanged,
  yourVeHNT,
  onVeHNTChanged,
  walletConnected,
}: CalculateFormProps) => {
  const theme = useTheme();
  return (
    <Fade in timeout={500}>
      <CalculateformBox>
        <ImageWrapper>
          <LoadingImage
            alt="loading"
            src="/images/whiskerAssistant.png"
            width={120}
            height={120}
          />
        </ImageWrapper>

        <Typography
          variant="body1"
          component="div"
          sx={{ flexGrow: 1, textAlign: "center" }}
        >
          Greetings! I'm Whisker, your trusty assistant for calculating rewards.
          Just let me know how much veHNT you plan to stake and choose a subDAO.
          I'll take care of the rest.
        </Typography>
        <FormControl
          fullWidth
          variant="standard"
          sx={{
            gap: theme.spacing(2),
          }}
        >
          <CustomSelect value={subDAO} onChange={onSubDAOChanged} />
          <CustomTextField
            value={yourVeHNT}
            fullWidth
            label="veHNT"
            variant="filled"
            InputProps={
              { disableUnderline: true } as Partial<OutlinedInputProps>
            }
            InputLabelProps={{ shrink: true }}
            type={"number"}
            onChange={onVeHNTChanged}
            disabled={walletConnected}
          />
        </FormControl>
      </CalculateformBox>
    </Fade>
  );
};

const RewardCalculator = () => {
  const { delegatedStakesInfo } = useHeliumSolana();
  const [calculated, setCalculated] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [yourVeHNT, setYourVeHNT] = React.useState<string | undefined>(
    undefined
  );
  const [yourVeHNTWithMult, setYourVeHNTWithMult] = React.useState<
    string | undefined
  >(undefined);
  const [subDAO, setSubDAO] = React.useState("iot");
  const [estimatedRewards, setEstimatedRewards] = React.useState(0);
  const wallet = useWallet();
  const anchorWallet = useAnchorWallet();

  const metaplex = useMemo(() => {
    const connection = new Connection(
      `https://rpc.helius.xyz/?api-key=${HELIUS_API_KEY}`
    );
    return new Metaplex(connection, { cluster: "mainnet-beta" });
  }, []);

  const anchorProvider = useMemo(() => {
    if (!anchorWallet) return;
    const connection = new Connection(
      `https://rpc.helius.xyz/?api-key=${HELIUS_API_KEY}`
    );
    const provider = new AnchorProvider(connection, anchorWallet, {});
    return provider;
  }, [anchorWallet]);

  metaplex.use(walletAdapterIdentity(wallet));

  useAsync(async () => {
    if (!wallet.connected || !wallet.publicKey || !anchorProvider) return;

    const { totalAmountDeposited, totalAmountDepositedWithMult } =
      await getVeHNT(wallet.publicKey, metaplex, subDAO, anchorProvider);
    setYourVeHNT(`${totalAmountDeposited}`);
    setYourVeHNTWithMult(`${totalAmountDepositedWithMult}`);
  }, [wallet, subDAO]);

  const handleCalculate = useCallback(async () => {
    if (!delegatedStakesInfo || !yourVeHNT) return;
    if (calculated) {
      setCalculated(false);
      setLoading(false);
      return;
    }

    setLoading(true);

    // your veHNT / (current veHNT + your veHNT) * daily_emissions
    let currentVeHNT = toNumber(
      BigInt(delegatedStakesInfo[subDAO].total.vehnt),
      8
    );

    let subDAOEmissions = 0;
    // Find date that is on or before today
    const today = new Date();
    const emission = dailyEmissions[subDAO].find((e) => {
      const emissionDate = new Date(e.startTime);
      return emissionDate <= today;
    });
    if (!emission) return;
    subDAOEmissions = Number(emission.emissionsPerEpoch.replace(/,/g, ""));
    const estimatedReward =
      (Number(yourVeHNTWithMult) / currentVeHNT) * (subDAOEmissions * 0.06);
    setEstimatedRewards(estimatedReward);
    setCalculated(true);
    setLoading(false);
  }, [calculated, loading, yourVeHNTWithMult]);

  const onVeHNTChanged = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      // Get value and keep trailing zeros
      const value = event.target.value;
      // Check if value is a number
      if (isNaN(Number(value))) return;
      // Check if number has more than 8 decimals
      if (value.split(".")[1]?.length > 8) return;

      setYourVeHNT(value);
      setYourVeHNTWithMult(value);
    },
    []
  );

  const onSubDAOChanged = useCallback(
    (event: { target: { value: string } }) => {
      setYourVeHNT("");
      setYourVeHNTWithMult("");
      setSubDAO(event.target.value);
    },
    []
  );

  return (
    <CustomCard>
      <CardInnerContainer>
        {calculated && (
          <CalculatedMessage
            subDAO={subDAO}
            estimatedRewards={estimatedRewards}
          />
        )}
        {!calculated && (
          <CalculateForm
            subDAO={subDAO}
            onSubDAOChanged={onSubDAOChanged}
            yourVeHNT={yourVeHNT}
            onVeHNTChanged={onVeHNTChanged}
            walletConnected={wallet.connected}
          />
        )}
        <CustomButton
          variant="contained"
          onClick={handleCalculate}
          disabled={loading || !yourVeHNT}
        >
          {loading && (
            <CircularProgress
              thickness={4}
              size={20}
              sx={{
                color: "white",
              }}
            />
          )}

          {!loading && !calculated && (
            <Typography
              fontWeight={500}
              variant="body1"
              component="div"
              sx={{ flexGrow: 1 }}
            >
              CALCULATE
            </Typography>
          )}
          {!loading && calculated && (
            <Typography
              fontWeight={500}
              variant="body1"
              component="div"
              sx={{ flexGrow: 1 }}
            >
              TRY AGAIN
            </Typography>
          )}
        </CustomButton>
        {!wallet.connected && (
          <WalletMultiButton
            style={{
              backgroundColor: "transparent",
              justifyContent: "center",
            }}
          />
        )}
        {wallet.connected && (
          <WalletDisconnectButton
            style={{
              backgroundColor: "transparent",
              justifyContent: "center",
            }}
          />
        )}
      </CardInnerContainer>
    </CustomCard>
  );
};

export default RewardCalculator;
