import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {
  Box,
  CircularProgress,
  InputBase,
  MenuItem,
  OutlinedInputProps,
  Select,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import dynamic from "next/dynamic";
import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import Image from "next/image";
import { Connection } from "@solana/web3.js";
import { AnchorProvider } from "@coral-xyz/anchor";
import { Mints } from "@/utils/constants";
import { createTransferSolTxn, createTransferTxn } from "@/utils/solanaUtils";
import CustomSnackbar from "../Snackbar";
import getConfig from "next/config";

const {
  publicRuntimeConfig: { HELIUS_API_KEY },
} = getConfig();

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

const CustomButton = styled(Button)(({ theme }) => ({
  alignSelf: "center",
  width: "fit-content",
  paddingLeft: theme.spacing(6),
  paddingRight: theme.spacing(6),
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

type CustomSelectProps = {
  value: string;
  onChange: (event: { target: { value: string } }) => void;
};

const CustomSelect = ({ value, onChange }: CustomSelectProps) => {
  return (
    <Select value={value} onChange={onChange} input={<BootstrapInput />}>
      <CustomMenuItem value="hnt">
        <Image alt="hnt" src="/images/hntIcon.svg" width={24} height={24} />
        {"HNT"}
      </CustomMenuItem>

      <CustomMenuItem value="iot">
        <Image alt="iot" src="/images/iotIcon.svg" width={24} height={24} />
        {"IOT"}
      </CustomMenuItem>
      <CustomMenuItem value="mobile">
        <Image
          alt="mobile"
          src="/images/mobileIcon.svg"
          width={24}
          height={24}
        />
        {"MOBILE"}
      </CustomMenuItem>
      <CustomMenuItem value="sol">
        <Box
          sx={{
            borderRadius: "50%",
            backgroundColor: "#000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "24px",
            height: "24px",
          }}
        >
          <Image
            alt="sol"
            src="/images/solanaIcon.svg"
            width={12}
            height={12}
          />
        </Box>
        {"SOL"}
      </CustomMenuItem>
    </Select>
  );
};

export type DonateDialogProps = {
  open: boolean;
  onClose: () => void;
};

export default function DonateDialog({ open, onClose }: DonateDialogProps) {
  const anchorWallet = useAnchorWallet();
  const wallet = useWallet();
  const theme = useTheme();
  const [loading, setLoading] = React.useState(false);
  const [amount, setAmount] = React.useState<string | undefined>();
  const [ticker, setTicker] = React.useState<string>("hnt");
  const [snackbarState, setSnackbarState] = React.useState<{
    open: boolean;
    message: string;
    severity: "error" | "info" | "success" | "warning";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const anchorProvider = React.useMemo(() => {
    if (!anchorWallet) return;
    const connection = new Connection(
      `https://rpc.helius.xyz/?api-key=${HELIUS_API_KEY}`
    );
    const provider = new AnchorProvider(connection, anchorWallet, {});
    return provider;
  }, [anchorWallet]);

  const onDonate = React.useCallback(async () => {
    try {
      if (!anchorProvider || !amount || !ticker) return;
      setLoading(true);

      const amountAsNumber = Number(amount);

      const mint = Mints[ticker];
      let decimals = 8;

      if (ticker === "iot" || ticker === "mobile") {
        decimals = 6;
      }

      const txn =
        ticker === "sol"
          ? await createTransferSolTxn(anchorProvider, amountAsNumber)
          : await createTransferTxn(
              anchorProvider,
              amountAsNumber,
              decimals,
              mint
            );

      await anchorProvider.sendAndConfirm(txn, undefined, {
        commitment: "confirmed",
      });

      setSnackbarState((s) => ({
        open: true,
        message: "Donation Successful!",
        severity: "success",
      }));
      setLoading(false);
    } catch (error) {
      setSnackbarState((s) => ({
        open: true,
        message: "Donation Failed!",
        severity: "error",
      }));
      setLoading(false);
    }
  }, [anchorProvider, amount, ticker]);

  const toggleSnackbar = () => {
    setSnackbarState((s) => ({ ...s, open: !s.open }));
  };

  const onVeHNTChanged = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      // Get value and keep trailing zeros
      const value = event.target.value;
      // Check if value is a number
      if (isNaN(Number(value))) return;
      let decimals = 8;
      if (ticker === "iot" || ticker === "mobile") {
        decimals = 6;
      }
      // Check if number has more than the tickers decimals
      if (value.split(".")[1]?.length > decimals) return;

      setAmount(value);
    },
    [ticker]
  );

  const onSelectChange = React.useCallback(
    (event: { target: { value: string } }) => {
      setAmount("");
      setTicker(event.target.value);
    },
    []
  );

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        sx={{
          // Hack to allow for wallet adapter dialog to be on top
          zIndex: 1039,
          "& .MuiPaper-root": {
            backgroundColor: "#111111",
            padding: theme.spacing(3),
            borderRadius: theme.spacing(3),
            gap: theme.spacing(2),
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: "center",
          }}
        >
          Donate to DeWiCats
        </DialogTitle>
        <DialogContentText
          sx={{
            textAlign: "center",
          }}
        >
          We meow with all our heart and purr with all our soul on this project.
          If you love what we're doing, would you paw-lease consider donating to
          help us keep the catnip flowing?
        </DialogContentText>

        <CustomSelect value={ticker} onChange={onSelectChange} />

        <CustomTextField
          value={amount}
          fullWidth
          label="Amount"
          variant="filled"
          InputProps={{ disableUnderline: true } as Partial<OutlinedInputProps>}
          InputLabelProps={{ shrink: true }}
          type={"number"}
          onChange={onVeHNTChanged}
        />
        <CustomButton
          onClick={onDonate}
          variant="contained"
          disabled={!amount || !wallet.connected || loading}
        >
          {!loading && (
            <Typography
              fontWeight={500}
              variant="body1"
              component="div"
              sx={{ flexGrow: 1 }}
            >
              Donate
            </Typography>
          )}

          {loading && (
            <CircularProgress thickness={4} size={20} sx={{ color: "white" }} />
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
      </Dialog>
      <CustomSnackbar
        open={snackbarState.open}
        message={snackbarState.message}
        severity={snackbarState.severity}
        onClose={toggleSnackbar}
      />
    </>
  );
}
