import { ToggleButton, ToggleButtonGroup, styled } from "@mui/material";
import React from "react";

const CustomToggleButton = styled(ToggleButton)(({ theme }) => ({
  backgroundColor: "#212121",
  color: "#fff",
  fontWeight: 700,
  borderRadius: "500px !important",
  paddingLeft: theme.spacing(4),
  paddingRight: theme.spacing(4),
  fontSize: "12px",

  "&.Mui-selected": {
    "&:hover": {
      backgroundColor: "#ffffff",
    },
    backgroundColor: "#fff",
    color: "#000",
  },

  "&:not(.Mui-selected)": {
    border: "1px solid #818181 !important",
  },

  "&:not(.Mui-selected):hover": {
    backgroundColor: "#111111",
  },
}));

const CustomToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  marginTop: theme.spacing(2),
  display: "flex",
  gap: theme.spacing(2),
}));

export type DewiToggleButtonGroupProps = {
  data: { value: string; label: string }[];
  selected: string;
  onChange: (
    ev: React.MouseEvent<HTMLElement, MouseEvent>,
    newValue: string
  ) => void;
};

const DewiToggleButtonGroup = ({
  data,
  onChange,
  selected,
}: DewiToggleButtonGroupProps) => {
  return (
    <CustomToggleButtonGroup
      color="primary"
      value={selected}
      exclusive
      aria-label="Platform"
      onChange={onChange}
    >
      {data.map(({ value, label }) => (
        <CustomToggleButton key={value} value={value}>
          {label}
        </CustomToggleButton>
      ))}
    </CustomToggleButtonGroup>
  );
};

export default DewiToggleButtonGroup;
