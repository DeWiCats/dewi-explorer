import React, { useMemo } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useTheme } from "@mui/material/styles";
import { Box, CircularProgress } from "@mui/material";
import useHeliumSolana, { Stats, Total } from "@/hooks/useHeliumSolana";
import { toNumber } from "@helium/spl-utils";

const secondsToDays = (seconds: number) => {
  return seconds / 60 / 60 / 24;
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function DelegatedStakesInfoTable() {
  const theme = useTheme();
  const { delegatedStakesInfo, fetchingDelegateStakesInfo } = useHeliumSolana();

  const columns = useMemo(() => {
    return [
      {
        header: "subDAO",
        align: "left",
      },
      {
        header: "count",
        align: "center",
      },
      {
        header: "vehnt",
        align: "center",
      },
      {
        header: "hnt",
        align: "center",
      },
      {
        header: "fall_rate",
        align: "center",
      },
      {
        header: "avg_hnt",
        align: "center",
      },
      {
        header: "avg_lockup",
        align: "center",
      },
      {
        header: "avg_vehnt",
        align: "center",
      },
      {
        header: "median_hnt",
        align: "center",
      },
      {
        header: "median_lockup",
        align: "center",
      },
      {
        header: "median_vehnt",
        align: "center",
      },
    ] as {
      header: string;
      align: "right" | "center" | "left" | "inherit" | "justify" | undefined;
    }[];
  }, []);

  const rows: (Stats & Total & { type: "iot" | "mobile" | "network" })[] =
    useMemo(() => {
      if (!delegatedStakesInfo) return [];

      let allRows: (Stats & Total & { type: "iot" | "mobile" | "network" })[] =
        [];

      allRows.push({
        type: "iot",
        ...delegatedStakesInfo.iot.stats,
        ...delegatedStakesInfo.iot.total,
      });

      allRows.push({
        type: "mobile",
        ...delegatedStakesInfo.mobile.stats,
        ...delegatedStakesInfo.mobile.total,
      });

      allRows.push({
        type: "network",
        ...delegatedStakesInfo.network.stats,
        ...delegatedStakesInfo.network.total,
      });

      return allRows;
    }, [delegatedStakesInfo]);

  return (
    <Box
      sx={{
        padding: theme.spacing(2),
      }}
    >
      <Paper
        sx={{
          width: "100%",
          overflow: "hidden",
          borderRadius: theme.spacing(2),
        }}
      >
        <TableContainer sx={{ height: "100%" }}>
          {fetchingDelegateStakesInfo ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <CircularProgress
                thickness={4}
                size={40}
                sx={{ color: "white" }}
              />
            </Box>
          ) : (
            <>
              <Table stickyHeader sx={{ minWidth: 700 }}>
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <StyledTableCell key={column.header} align={column.align}>
                        {column.header}
                      </StyledTableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <StyledTableRow key={row.type}>
                      <StyledTableCell component="th" scope="row">
                        {row.type}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {row.count}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {toNumber(BigInt(row.vehnt), 8).toLocaleString()}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {toNumber(BigInt(row.hnt), 8).toLocaleString()}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {toNumber(BigInt(row.fall_rate), 8).toLocaleString()}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {toNumber(BigInt(row.avg_hnt), 8).toLocaleString()}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {secondsToDays(row.avg_lockup).toLocaleString()}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {toNumber(BigInt(row.avg_vehnt), 8).toLocaleString()}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {toNumber(BigInt(row.median_hnt), 8).toLocaleString()}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {secondsToDays(row.median_lockup).toLocaleString()}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {toNumber(BigInt(row.median_vehnt), 8).toLocaleString()}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
        </TableContainer>
      </Paper>
    </Box>
  );
}
