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
import { TablePagination } from "@mui/material";
import useHeliumSolana, { Position } from "@/hooks/useHeliumSolana";
import TableToolbar from "./Toolbar";

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

export default function CustomizedTables() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const theme = useTheme();
  const { delegatedStakes, fetchMoreDelegatedStakes } = useHeliumSolana();

  const columns = useMemo(() => {
    return [
      {
        header: "delegated_position_key",
        align: "left",
      },
      {
        header: "duration_s",
        align: "left",
      },
      {
        header: "end_ts",
        align: "left",
      },
      {
        header: "hnt_amount",
        align: "left",
      },
      {
        header: "last_claimed_epoch",
        align: "left",
      },
      {
        header: "lockup_type",
        align: "left",
      },
      {
        header: "position_key",
        align: "left",
      },
      {
        header: "purged",
        align: "left",
      },
      {
        header: "start_ts",
        align: "left",
      },
      {
        header: "sub_dao",
        align: "left",
      },
      {
        header: "vehnt",
        align: "left",
      },
    ] as {
      header: string;
      align: "right" | "center" | "left" | "inherit" | "justify" | undefined;
    }[];
  }, []);

  const data = useMemo(() => {
    if (!delegatedStakes) return [];
    return delegatedStakes;
  }, [delegatedStakes]);

  const rows: Position[] = useMemo(() => {
    if (!data) return [];
    const positions = data;
    // calculate positions based on page and total rows per page
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;
    return positions.slice(start, end);
  }, [page, rowsPerPage, data]);

  const handleChangePage = (_: unknown, newPage: number) => {
    // Check if we need to fetch more data
    if (newPage === Math.floor(data.length / rowsPerPage) - 1) {
      fetchMoreDelegatedStakes();
    }
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  return (
    <Paper
      sx={{
        width: "100%",
        overflow: "hidden",
        maxHeight: 760,
        borderRadius: theme.spacing(2),
      }}
    >
      <TableContainer sx={{ maxHeight: 700 }}>
        <TableToolbar />
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
              <StyledTableRow key={row.delegated_position_key}>
                <StyledTableCell component="th" scope="row">
                  {row.delegated_position_key}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {row.duration_s}
                </StyledTableCell>
                <StyledTableCell align="right">{row.end_ts}</StyledTableCell>
                <StyledTableCell align="right">
                  {row.hnt_amount}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {row.last_claimed_epoch}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {row.lockup_type}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {row.position_key}
                </StyledTableCell>
                <StyledTableCell align="right">{row.purged}</StyledTableCell>
                <StyledTableCell align="right">{row.start_ts}</StyledTableCell>
                <StyledTableCell align="right">{row.sub_dao}</StyledTableCell>
                <StyledTableCell align="right">{row.vehnt}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
