import { HNT_MINT, IOT_MINT, MOBILE_MINT } from "@helium/spl-utils";
import { NATIVE_MINT } from "@solana/spl-token";

export const Mints = {
  hnt: HNT_MINT.toBase58(),
  iot: IOT_MINT.toBase58(),
  mobile: MOBILE_MINT.toBase58(),
  sol: NATIVE_MINT.toBase58(),
} as Record<string, string>;
