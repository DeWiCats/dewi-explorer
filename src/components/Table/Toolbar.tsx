import { IconButton, Toolbar, Tooltip, Typography } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import useHeliumSolana from "@/hooks/useHeliumSolana";
import { useCallback } from "react";
function TableToolbar() {
  const { fetchDelegatedStakesCsv } = useHeliumSolana();

  const handleDownloadCsv = useCallback(async () => {
    const csv = await fetchDelegatedStakesCsv();
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "delegatedStakes.csv";
    a.click();
  }, []);

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
      }}
    >
      <Typography
        sx={{ flex: "1 1 100%" }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        Raw Data
      </Typography>

      <Tooltip title="Download csv">
        <IconButton onClick={handleDownloadCsv}>
          <DownloadIcon />
        </IconButton>
      </Tooltip>
    </Toolbar>
  );
}

export default TableToolbar;
