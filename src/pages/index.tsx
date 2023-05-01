import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import dynamic from "next/dynamic";
import Table from "@/components/Table";
import ResponsiveAppBar from "@/components/AppBar";
import { use, useCallback, useMemo, useState } from "react";
import { Box, Fade, Typography, styled } from "@mui/material";
import DewiToggleButtonGroup from "@/components/ToggleButtonGroup";
import useHeliumSolana from "@/hooks/useHeliumSolana";
import DelegatedStakesInfoTable from "@/components/DelegatedStakesInfoTable";
const inter = Inter({ subsets: ["latin"] });

const Chart = dynamic(() => import("@/components/Chart"), { ssr: false });

const MainContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(4),
  display: "flex",
  flexGrow: 1,
  width: "100%",
}));

const TabWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "flex",
}));

const Title = styled(Typography)(({ theme }) => ({
  color: "white",
  margin: theme.spacing(4),
}));

export default function Home() {
  useHeliumSolana();
  const height = useMemo(() => {
    if (typeof window === "undefined") return 0;
    return window.screen.height * 0.5;
  }, []);

  const [selectedToggle, setSelectedToggle] = useState("charts");

  const data = useMemo(() => {
    return [
      {
        label: "Charts",
        value: "charts",
      },
      {
        label: "RawData",
        value: "rawdata",
      },
    ];
  }, []);

  const onToggleChange = useCallback(
    (_: React.MouseEvent<HTMLElement>, value: string) => {
      if (value) {
        setSelectedToggle(value);
      }
    },
    []
  );

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
      <main className={`${styles.main} ${inter.className}`}>
        <ResponsiveAppBar />

        <Title variant="body1">
          Dewi Explorer is a community-built tool that allows users to visualize
          the total amount of staked veHNT and total delegated veHNT for each
          subDAO. It's an open-source project designed for community
          development.
        </Title>

        <DewiToggleButtonGroup
          data={data}
          selected={selectedToggle}
          onChange={onToggleChange}
        />

        <MainContainer>
          {selectedToggle === "rawdata" && (
            <Fade in timeout={1000}>
              <TabWrapper>
                <Table />
              </TabWrapper>
            </Fade>
          )}
          {selectedToggle === "charts" && (
            <Fade in timeout={1000}>
              <TabWrapper
                sx={{
                  flexDirection: "column",
                }}
              >
                <Chart height={height} width={400} />
                <DelegatedStakesInfoTable />
              </TabWrapper>
            </Fade>
          )}
        </MainContainer>
      </main>
    </>
  );
}
