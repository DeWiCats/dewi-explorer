import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import ResponsiveAppBar from "@/components/AppBar";
import { Box, styled } from "@mui/material";
import useHeliumSolana from "@/hooks/useHeliumSolana";
import RewardCalculator from "@/components/Calculator";

const inter = Inter({ subsets: ["latin"] });

const MainContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(4),
  display: "flex",
  flexGrow: 1,
  width: "100%",
  justifyContent: "center",
  alignItems: "center",
}));

export default function Home() {
  useHeliumSolana();

  return (
    <>
      <Head>
        <title>Dewi Explorer</title>
        <meta
          name="description"
          content="Dewi Explorer is a community-built tool that allows users to visualize
          the total amount of staked veHNT and total delegated veHNT for each
          subDAO. It's an open-source project designed for community
          development."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        className={`${styles.main} ${inter.className}`}
        style={{
          height: "100vh",
          overflow: "auto",
        }}
      >
        <ResponsiveAppBar />

        <MainContainer>
          <RewardCalculator />
        </MainContainer>
      </main>
    </>
  );
}
