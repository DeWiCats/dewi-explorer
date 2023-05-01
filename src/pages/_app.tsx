import { ThemeProvider, createTheme } from "@mui/material";
import type { AppProps } from "next/app";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolletWalletAdapter,
  SolletExtensionWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import { useMemo } from "react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// Use require instead of import since order matters
require("@solana/wallet-adapter-react-ui/styles.css");
require("@/styles/globals.css");

export default function App({ Component, pageProps }: AppProps) {
  const theme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  const network = "mainnet-beta" as WalletAdapterNetwork;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolletWalletAdapter({ network }),
      new SolletExtensionWalletAdapter({ network }),
    ],
    [network]
  );

  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyA6kTg2PL1SdhUx0XcBbuaZ6LuMc8Fc8gM",
    authDomain: "dewi-explorer.firebaseapp.com",
    projectId: "dewi-explorer",
    storageBucket: "dewi-explorer.appspot.com",
    messagingSenderId: "719726647212",
    appId: "1:719726647212:web:b97a1031bbea1dbd460c09",
    measurementId: "G-ZC1Z68LYHP",
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = useMemo(() => {
    if (typeof window === "undefined") return;
    getAnalytics(app);
  }, [app]);
  return (
    <ThemeProvider theme={theme}>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect={true}>
          <WalletModalProvider>
            <Component {...pageProps} />
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </ThemeProvider>
  );
}
