import {
  AppBar,
  Box,
  Checkbox,
  Divider,
  Drawer,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Radio,
  RadioGroup,
  Toolbar,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import React, { Dispatch, SetStateAction } from "react";
import CloseIcon from "@mui/icons-material/Close";

const FormGroupBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  gap: theme.spacing(2),
}));

const CustomFormControl = styled(FormControl)(({ theme }) => ({
  flexGrow: 1,
}));

const CustomDivider = styled(Divider)(({ theme }) => ({
  height: "100%",
  width: "1px",
  backgroundColor: "#818181",
}));

export type ChartDrawerProps = {
  open: boolean;
  toggleDrawer: () => void;
  showGridRows: boolean;
  showGridColumns: boolean;
  setGridProps: Dispatch<SetStateAction<[boolean, boolean]>>;
  setRenderHorizontally: (renderHorizontally: boolean) => void;
  renderHorizontally: boolean;
  renderBarStackOrGroup: string;
  setRenderBarStackOrGroup: Dispatch<
    SetStateAction<"none" | "bar" | "barstack" | "bargroup">
  >;
  setRenderAreaLineOrStack: Dispatch<
    SetStateAction<"area" | "line" | "none" | "areastack">
  >;
  renderAreaLineOrStack: string;
  curveType: string;
  setCurveType: Dispatch<SetStateAction<"step" | "linear" | "cardinal">>;
  renderGlyphSeries: boolean;
  setRenderGlyphSeries: (renderGlyphSeries: boolean) => void;
  glyphComponent: string;
  setGlyphComponent: Dispatch<
    SetStateAction<"circle" | "star" | "cross" | "🎈">
  >;
  stackOffset: string | undefined;
  setStackOffset: Dispatch<
    SetStateAction<"expand" | "wiggle" | "diverging" | "silhouette" | undefined>
  >;
  xAxisOrientation: string;
  setXAxisOrientation: Dispatch<SetStateAction<"top" | "bottom">>;
  yAxisOrientation: string;
  setYAxisOrientation: Dispatch<SetStateAction<"right" | "left">>;
};

const ChartDrawer = ({
  open,
  toggleDrawer,
  showGridRows,
  showGridColumns,
  setGridProps,
  setRenderHorizontally,
  renderHorizontally,
  renderBarStackOrGroup,
  setRenderBarStackOrGroup,
  setRenderAreaLineOrStack,
  renderAreaLineOrStack,
  curveType,
  setCurveType,
  renderGlyphSeries,
  setRenderGlyphSeries,
  glyphComponent,
  setGlyphComponent,
  stackOffset,
  setStackOffset,
  xAxisOrientation,
  setXAxisOrientation,
  yAxisOrientation,
  setYAxisOrientation,
}: ChartDrawerProps) => {
  const theme = useTheme();

  return (
    <Drawer anchor={"right"} open={open} onClose={toggleDrawer}>
      <AppBar
        position="static"
        sx={{
          boxShadow: 0,
          borderBottom: `1px solid #818181`,
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            padding: theme.spacing(1),
            marginLeft: theme.spacing(2),
          }}
        >
          <Typography variant="h6" flex={1}>
            Edit Chart
          </Typography>
          <IconButton onClick={toggleDrawer}>
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          padding: theme.spacing(4),
          gap: theme.spacing(2),
        }}
      >
        <FormGroupBox>
          {/** grid */}
          <CustomFormControl>
            <FormLabel>Grid</FormLabel>
            <RadioGroup defaultValue="none" name="radio-buttons-group-vertical">
              <FormControlLabel
                value="rows"
                control={<Radio onChange={() => setGridProps([true, false])} />}
                checked={showGridRows && !showGridColumns}
                label="Rows"
              />
              <FormControlLabel
                value="column"
                control={<Radio onChange={() => setGridProps([false, true])} />}
                label="Column"
                checked={!showGridRows && showGridColumns}
              />
              <FormControlLabel
                value="both"
                control={<Radio onChange={() => setGridProps([true, true])} />}
                label="Both"
                checked={showGridRows && showGridColumns}
              />
              <FormControlLabel
                value="none"
                control={
                  <Radio onChange={() => setGridProps([false, false])} />
                }
                label="None"
                checked={!showGridRows && !showGridColumns}
              />
            </RadioGroup>
          </CustomFormControl>
          <CustomDivider />
          {/** series */}
          {/** orientation */}
          <CustomFormControl>
            <FormLabel>Orientation</FormLabel>
            <RadioGroup defaultValue="dark" name="radio-buttons-group">
              <FormControlLabel
                value="vertical"
                control={
                  <Radio onChange={() => setRenderHorizontally(false)} />
                }
                checked={!renderHorizontally}
                label="Vertical"
              />
              <FormControlLabel
                value="horizontal"
                control={<Radio onChange={() => setRenderHorizontally(true)} />}
                checked={renderHorizontally}
                label="Horizontal"
              />
            </RadioGroup>
          </CustomFormControl>
        </FormGroupBox>
        <FormGroupBox>
          {/** Line Series */}
          <CustomFormControl>
            <FormLabel>Line Series</FormLabel>
            <RadioGroup defaultValue="area" name="radio-buttons-group">
              <FormControlLabel
                value="line"
                control={
                  <Radio
                    onChange={() => {
                      if (
                        renderBarStackOrGroup === "barstack" ||
                        renderBarStackOrGroup === "bargroup"
                      ) {
                        setRenderBarStackOrGroup("none");
                      }
                      setRenderAreaLineOrStack("line");
                    }}
                  />
                }
                checked={renderAreaLineOrStack === "line"}
                label="Line"
              />
              <FormControlLabel
                value="area"
                control={
                  <Radio
                    onChange={() => {
                      if (
                        renderBarStackOrGroup === "barstack" ||
                        renderBarStackOrGroup === "bargroup"
                      ) {
                        setRenderBarStackOrGroup("none");
                      }
                      setRenderAreaLineOrStack("area");
                    }}
                  />
                }
                checked={renderAreaLineOrStack === "area"}
                label="Area"
              />
              <FormControlLabel
                value="area-stack"
                control={
                  <Radio
                    onChange={() => {
                      setRenderBarStackOrGroup("none");
                      setRenderAreaLineOrStack("areastack");
                    }}
                  />
                }
                checked={renderAreaLineOrStack === "areastack"}
                label="Area Stack"
              />
              <FormControlLabel
                value="none"
                control={
                  <Radio onChange={() => setRenderAreaLineOrStack("none")} />
                }
                checked={renderAreaLineOrStack === "none"}
                label="None"
              />
            </RadioGroup>
          </CustomFormControl>
          <CustomDivider />
          {/** Curve Shape */}
          <CustomFormControl>
            <FormLabel>Curve Shape</FormLabel>
            <RadioGroup defaultValue="linear" name="radio-buttons-group">
              <FormControlLabel
                value="linear"
                control={<Radio onChange={() => setCurveType("linear")} />}
                checked={curveType === "linear"}
                label="Linear"
              />
              <FormControlLabel
                value="cardinal-smooth"
                control={<Radio onChange={() => setCurveType("cardinal")} />}
                checked={curveType === "cardinal"}
                label="Cardinal (smooth)"
              />
              <FormControlLabel
                value="step"
                control={<Radio onChange={() => setCurveType("step")} />}
                checked={curveType === "step"}
                label="Step"
              />
            </RadioGroup>
          </CustomFormControl>
        </FormGroupBox>

        <FormGroupBox>
          {/** glyph */}
          <CustomFormControl>
            <FormLabel>Glyph Series</FormLabel>
            <FormControlLabel
              control={
                <Checkbox
                  onChange={() => setRenderGlyphSeries(!renderGlyphSeries)}
                  checked={renderGlyphSeries}
                />
              }
              label="Render Glyphs"
            />
            <RadioGroup defaultValue="linear" name="radio-buttons-group">
              <FormControlLabel
                value="circle"
                control={
                  <Radio
                    disabled={!renderGlyphSeries}
                    onChange={() => setGlyphComponent("circle")}
                  />
                }
                checked={glyphComponent === "circle"}
                label="Circle"
              />
              <FormControlLabel
                value="star"
                control={
                  <Radio
                    disabled={!renderGlyphSeries}
                    onChange={() => setGlyphComponent("star")}
                  />
                }
                checked={glyphComponent === "star"}
                label="star"
              />
              <FormControlLabel
                value="cross"
                control={
                  <Radio
                    disabled={!renderGlyphSeries}
                    onChange={() => setGlyphComponent("cross")}
                  />
                }
                checked={glyphComponent === "cross"}
                label="cross"
              />
              <FormControlLabel
                value="balloon"
                control={
                  <Radio
                    disabled={!renderGlyphSeries}
                    onChange={() => setGlyphComponent("🎈")}
                  />
                }
                checked={glyphComponent === "🎈"}
                label="🎈"
              />
            </RadioGroup>
          </CustomFormControl>
          <CustomDivider />
          {/** bar series */}
          <CustomFormControl>
            <FormLabel>Bar Series</FormLabel>
            <RadioGroup defaultValue="none" name="radio-buttons-group">
              <FormControlLabel
                value="bar"
                control={
                  <Radio
                    onChange={() => {
                      if (renderAreaLineOrStack === "areastack") {
                        setRenderAreaLineOrStack("none");
                      }
                      setRenderBarStackOrGroup("bar");
                    }}
                  />
                }
                checked={renderBarStackOrGroup === "bar"}
                label="Bar"
              />
              <FormControlLabel
                value="bar-stack"
                control={
                  <Radio
                    onChange={() => {
                      setRenderAreaLineOrStack("none");
                      setRenderBarStackOrGroup("barstack");
                    }}
                  />
                }
                checked={renderBarStackOrGroup === "barstack"}
                label="Bar Stack"
              />
              <FormControlLabel
                value="bar-group"
                control={
                  <Radio
                    onChange={() => {
                      setRenderAreaLineOrStack("none");
                      setRenderBarStackOrGroup("bargroup");
                    }}
                  />
                }
                checked={renderBarStackOrGroup === "bargroup"}
                label="Bar Group"
              />
              <FormControlLabel
                value="none"
                control={
                  <Radio onChange={() => setRenderBarStackOrGroup("none")} />
                }
                checked={renderBarStackOrGroup === "none"}
                label="None"
              />
            </RadioGroup>
          </CustomFormControl>
        </FormGroupBox>

        <FormGroupBox>
          {/** stack series offset */}
          <CustomFormControl>
            <FormLabel>Stack Series Offset</FormLabel>
            <RadioGroup defaultValue="auto" name="radio-buttons-group">
              <FormControlLabel
                value="auto"
                control={<Radio onChange={() => setStackOffset(undefined)} />}
                checked={stackOffset == null}
                label="Auto"
              />
              <FormControlLabel
                value="expand"
                control={<Radio onChange={() => setStackOffset("expand")} />}
                label="Expand"
                checked={stackOffset === "expand"}
              />
              <FormControlLabel
                value="wiggle"
                control={<Radio onChange={() => setStackOffset("wiggle")} />}
                label="Wiggle"
                checked={stackOffset === "wiggle"}
              />
            </RadioGroup>
          </CustomFormControl>
          <CustomDivider />
          {/** axes */}
          <CustomFormControl>
            <FormLabel>Axes</FormLabel>
            <RadioGroup
              defaultValue="bottom"
              name="radio-buttons-group-vertical"
            >
              <FormControlLabel
                value="top"
                control={<Radio onChange={() => setXAxisOrientation("top")} />}
                checked={xAxisOrientation === "top"}
                label="Top"
              />
              <FormControlLabel
                value="bottom"
                control={
                  <Radio onChange={() => setXAxisOrientation("bottom")} />
                }
                label="Bottom"
                checked={xAxisOrientation === "bottom"}
              />
            </RadioGroup>
            <RadioGroup
              defaultValue="left"
              name="radio-buttons-group-horizontal"
            >
              <FormControlLabel
                value="left"
                control={<Radio onChange={() => setYAxisOrientation("left")} />}
                checked={yAxisOrientation === "left"}
                label="Left"
              />
              <FormControlLabel
                value="right"
                control={
                  <Radio onChange={() => setYAxisOrientation("right")} />
                }
                label="Right"
                checked={yAxisOrientation === "right"}
              />
            </RadioGroup>
          </CustomFormControl>
        </FormGroupBox>
      </Box>
    </Drawer>
  );
};

export default ChartDrawer;
