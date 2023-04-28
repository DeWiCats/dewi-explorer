/* eslint-disable jsx-a11y/accessible-emoji */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useCallback, useMemo, useRef, useState } from "react";
import { XYChartTheme } from "@visx/xychart";
import { PatternLines } from "@visx/pattern";
import { GlyphProps } from "@visx/xychart/lib/types";
import { AnimationTrajectory } from "@visx/react-spring/lib/types";
import { GlyphCross, GlyphDot, GlyphStar } from "@visx/glyph";
import { curveLinear, curveStep, curveCardinal } from "@visx/curve";
import { RenderTooltipGlyphProps } from "@visx/xychart/lib/components/Tooltip";
import customTheme from "./customTheme";
import userPrefersReducedMotion from "./userPrefersReducedMotion";
import getAnimatedOrUnanimatedComponents from "./getAnimatedOrUnanimatedComponents";
import { Fab } from "@mui/material";
const dateScaleConfig = { type: "band", paddingInner: 0.3 } as const;
const temperatureScaleConfig = { type: "linear" } as const;
const numTicks = 4;
import EditIcon from "@mui/icons-material/Edit";
import ChartDrawer from "./ChartDrawer";
import useHeliumSolana, { epochInfo } from "@/hooks/useHeliumSolana";

const getEpoch = (d: epochInfo) => d.epoch;
const getIOTveHNT = (d: epochInfo) => d.iot_vehnt_at_epoch_start;
const getMobileveHNT = (d: epochInfo) => d.mobile_vehnt_at_epoch_start;
const defaultAnnotationDataIndex = 13;
const selectedDatumPatternId = "xychart-selected-datum";

type Accessor = (d: epochInfo) => number | string;

interface Accessors {
  IOT: Accessor;
  MOBILE: Accessor;
}

type DataKey = keyof Accessors;

type SimpleScaleConfig = { type: "band" | "linear"; paddingInner?: number };

type ProvidedProps = {
  accessors: {
    x: Accessors;
    y: Accessors;
    date: Accessor;
  };
  animationTrajectory?: AnimationTrajectory;
  annotationDataKey: DataKey | null;
  annotationDatum?: epochInfo;
  annotationLabelPosition: { dx: number; dy: number };
  annotationType?: "line" | "circle";
  colorAccessorFactory: (key: DataKey) => (d: epochInfo) => string | null;
  config: {
    x: SimpleScaleConfig;
    y: SimpleScaleConfig;
  };
  curve: typeof curveLinear | typeof curveCardinal | typeof curveStep;
  data: epochInfo[];
  editAnnotationLabelPosition: boolean;
  numTicks: number;
  setAnnotationDataIndex: (index: number) => void;
  setAnnotationDataKey: (key: DataKey | null) => void;
  setAnnotationLabelPosition: (position: { dx: number; dy: number }) => void;
  renderAreaSeries: boolean;
  renderAreaStack: boolean;
  renderBarGroup: boolean;
  renderBarSeries: boolean;
  renderBarStack: boolean;
  renderGlyph: React.FC<GlyphProps<epochInfo>>;
  renderGlyphSeries: boolean;
  enableTooltipGlyph: boolean;
  renderTooltipGlyph: React.FC<RenderTooltipGlyphProps<epochInfo>>;
  renderHorizontally: boolean;
  renderLineSeries: boolean;
  sharedTooltip: boolean;
  showGridColumns: boolean;
  showGridRows: boolean;
  showHorizontalCrosshair: boolean;
  showTooltip: boolean;
  showVerticalCrosshair: boolean;
  snapTooltipToDatumX: boolean;
  snapTooltipToDatumY: boolean;
  stackOffset?: "wiggle" | "expand" | "diverging" | "silhouette";
  theme: XYChartTheme;
  xAxisOrientation: "top" | "bottom";
  yAxisOrientation: "left" | "right";
} & ReturnType<typeof getAnimatedOrUnanimatedComponents>;

type ControlsProps = {
  children: (props: ProvidedProps) => React.ReactNode;
};

export default function ChartControls({ children }: ControlsProps) {
  const { epochs } = useHeliumSolana();
  const [useAnimatedComponents, setUseAnimatedComponents] = useState(
    !userPrefersReducedMotion()
  );
  const [animationTrajectory, setAnimationTrajectory] = useState<
    AnimationTrajectory | undefined
  >("center");
  const [gridProps, setGridProps] = useState<[boolean, boolean]>([
    false,
    false,
  ]);
  const [showGridRows, showGridColumns] = gridProps;
  const [xAxisOrientation, setXAxisOrientation] = useState<"top" | "bottom">(
    "bottom"
  );
  const [yAxisOrientation, setYAxisOrientation] = useState<"left" | "right">(
    "right"
  );
  const [renderHorizontally, setRenderHorizontally] = useState(false);
  const showTooltip = true;
  const [annotationDataKey, setAnnotationDataKey] =
    useState<ProvidedProps["annotationDataKey"]>(null);
  const [annotationType, setAnnotationType] =
    useState<ProvidedProps["annotationType"]>("circle");
  const [showVerticalCrosshair, setShowVerticalCrosshair] = useState(true);
  const [showHorizontalCrosshair, setShowHorizontalCrosshair] = useState(false);
  const [snapTooltipToDatumX, setSnapTooltipToDatumX] = useState(true);
  const [snapTooltipToDatumY, setSnapTooltipToDatumY] = useState(true);
  const [sharedTooltip, setSharedTooltip] = useState(true);
  const [renderBarStackOrGroup, setRenderBarStackOrGroup] = useState<
    "bar" | "barstack" | "bargroup" | "none"
  >("none");
  const [renderAreaLineOrStack, setRenderAreaLineOrStack] = useState<
    "line" | "area" | "areastack" | "none"
  >("areastack");
  const [stackOffset, setStackOffset] =
    useState<ProvidedProps["stackOffset"]>();
  const [renderGlyphSeries, setRenderGlyphSeries] = useState(false);
  const [editAnnotationLabelPosition, setEditAnnotationLabelPosition] =
    useState(false);
  const [annotationLabelPosition, setAnnotationLabelPosition] = useState({
    dx: -40,
    dy: -20,
  });
  const [annotationDataIndex, setAnnotationDataIndex] = useState(
    defaultAnnotationDataIndex
  );
  const [fewerDatum, setFewerDatum] = useState(false);
  const [missingValues, setMissingValues] = useState(false);
  const [glyphComponent, setGlyphComponent] = useState<
    "star" | "cross" | "circle" | "🎈"
  >("star");
  const [curveType, setCurveType] = useState<"linear" | "cardinal" | "step">(
    "linear"
  );
  const glyphOutline = customTheme.gridStyles.stroke;

  const renderGlyph = useCallback(
    ({
      size,
      color,
      onPointerMove,
      onPointerOut,
      onPointerUp,
    }: GlyphProps<epochInfo>) => {
      const handlers = { onPointerMove, onPointerOut, onPointerUp };
      if (glyphComponent === "star") {
        return (
          <GlyphStar
            stroke={glyphOutline}
            fill={color}
            size={size * 10}
            {...handlers}
          />
        );
      }
      if (glyphComponent === "circle") {
        return (
          <GlyphDot
            stroke={glyphOutline}
            fill={color}
            r={size / 2}
            {...handlers}
          />
        );
      }
      if (glyphComponent === "cross") {
        return (
          <GlyphCross
            stroke={glyphOutline}
            fill={color}
            size={size * 10}
            {...handlers}
          />
        );
      }
      return (
        <text dx="-0.75em" dy="0.25em" fontSize={14} {...handlers}>
          🍍
        </text>
      );
    },
    [glyphComponent, glyphOutline]
  );
  const enableTooltipGlyph = false;
  const tooltipGlyphComponent = "star";
  const renderTooltipGlyph = useCallback(
    ({
      x,
      y,
      size,
      color,
      onPointerMove,
      onPointerOut,
      onPointerUp,
      isNearestDatum,
    }: RenderTooltipGlyphProps<epochInfo>) => {
      const handlers = { onPointerMove, onPointerOut, onPointerUp };
      if (tooltipGlyphComponent === "star") {
        return (
          <GlyphStar
            left={x}
            top={y}
            stroke={glyphOutline}
            fill={color}
            size={size * 10}
            {...handlers}
          />
        );
      }
      if (tooltipGlyphComponent === "circle") {
        return (
          <GlyphDot
            left={x}
            top={y}
            stroke={glyphOutline}
            fill={color}
            r={size}
            {...handlers}
          />
        );
      }
      if (tooltipGlyphComponent === "cross") {
        return (
          <GlyphCross
            left={x}
            top={y}
            stroke={glyphOutline}
            fill={color}
            size={size * 10}
            {...handlers}
          />
        );
      }
      return (
        <text x={x} y={y} dx="-0.75em" dy="0.25em" fontSize={14} {...handlers}>
          {isNearestDatum ? "🍍" : "🍌"}
        </text>
      );
    },
    [tooltipGlyphComponent, glyphOutline]
  );
  // for series that support it, return a colorAccessor which returns a custom color if the datum is selected
  const colorAccessorFactory = useCallback(
    (dataKey: DataKey) => (d: epochInfo) =>
      annotationDataKey === dataKey && d === epochs[annotationDataIndex]
        ? `url(#${selectedDatumPatternId})`
        : null,
    [annotationDataIndex, annotationDataKey]
  );

  const accessors = useMemo(
    () => ({
      x: {
        IOT: renderHorizontally ? getIOTveHNT : getEpoch,
        MOBILE: renderHorizontally ? getMobileveHNT : getEpoch,
      },
      y: {
        IOT: renderHorizontally ? getEpoch : getIOTveHNT,
        MOBILE: renderHorizontally ? getEpoch : getMobileveHNT,
      },
      date: getEpoch,
    }),
    [renderHorizontally]
  );

  const config = useMemo(
    () => ({
      x: renderHorizontally ? temperatureScaleConfig : dateScaleConfig,
      y: renderHorizontally ? dateScaleConfig : temperatureScaleConfig,
    }),
    [renderHorizontally]
  );

  const [open, setOpen] = useState<boolean>(false);

  const toggleDrawer = useCallback(() => {
    setOpen((s) => !s);
  }, []);

  // cannot snap to a stack position
  const canSnapTooltipToDatum =
    renderBarStackOrGroup !== "barstack" &&
    renderAreaLineOrStack !== "areastack";

  return (
    <>
      {children({
        accessors,
        animationTrajectory,
        annotationDataKey,
        annotationDatum: epochs[annotationDataIndex],
        annotationLabelPosition,
        annotationType,
        colorAccessorFactory,
        config,
        curve:
          (curveType === "cardinal" && curveCardinal) ||
          (curveType === "step" && curveStep) ||
          curveLinear,
        data: epochs,
        editAnnotationLabelPosition,
        numTicks,
        renderBarGroup: renderBarStackOrGroup === "bargroup",
        renderBarSeries: renderBarStackOrGroup === "bar",
        renderBarStack: renderBarStackOrGroup === "barstack",
        renderGlyphSeries,
        renderGlyph,
        enableTooltipGlyph,
        renderTooltipGlyph,
        renderHorizontally,
        renderAreaSeries: renderAreaLineOrStack === "area",
        renderAreaStack: renderAreaLineOrStack === "areastack",
        renderLineSeries: renderAreaLineOrStack === "line",
        setAnnotationDataIndex,
        setAnnotationDataKey,
        setAnnotationLabelPosition,
        sharedTooltip,
        showGridColumns,
        showGridRows,
        showHorizontalCrosshair,
        showTooltip,
        showVerticalCrosshair,
        snapTooltipToDatumX: canSnapTooltipToDatum && snapTooltipToDatumX,
        snapTooltipToDatumY: canSnapTooltipToDatum && snapTooltipToDatumY,
        stackOffset,
        theme: customTheme,
        xAxisOrientation,
        yAxisOrientation,
        ...getAnimatedOrUnanimatedComponents(useAnimatedComponents),
      })}
      {/** This style is used for annotated elements via colorAccessor. */}
      <svg className="pattern-lines">
        <PatternLines
          id={selectedDatumPatternId}
          width={6}
          height={6}
          orientation={["diagonalRightToLeft"]}
          stroke={customTheme?.axisStyles.x.bottom.axisLine.stroke}
          strokeWidth={1.5}
        />
      </svg>
      <Fab
        onClick={toggleDrawer}
        aria-label="edit"
        sx={{
          background: "white",
          position: "absolute",
          top: 0,
          right: 0,
        }}
      >
        <EditIcon />
      </Fab>
      <div className="controls">
        <ChartDrawer
          open={open}
          toggleDrawer={toggleDrawer}
          showGridRows={showGridRows}
          showGridColumns={showGridColumns}
          setGridProps={setGridProps}
          setRenderHorizontally={setRenderHorizontally}
          renderHorizontally={renderHorizontally}
          renderBarStackOrGroup={renderBarStackOrGroup}
          setRenderBarStackOrGroup={setRenderBarStackOrGroup}
          setRenderAreaLineOrStack={setRenderAreaLineOrStack}
          renderAreaLineOrStack={renderAreaLineOrStack}
          curveType={curveType}
          setCurveType={setCurveType}
          renderGlyphSeries={renderGlyphSeries}
          setRenderGlyphSeries={setRenderGlyphSeries}
          glyphComponent={glyphComponent}
          setGlyphComponent={setGlyphComponent}
          stackOffset={stackOffset}
          setStackOffset={setStackOffset}
          xAxisOrientation={xAxisOrientation}
          setXAxisOrientation={setXAxisOrientation}
          yAxisOrientation={yAxisOrientation}
          setYAxisOrientation={setYAxisOrientation}
        />
      </div>
      <style jsx>{`
        .controls {
          font-size: 13px;
          line-height: 1.5em;
        }
        .controls > div {
          margin-bottom: 4px;
        }
        label {
          font-size: 12px;
        }
        input[type="radio"] {
          height: 10px;
        }
        .pattern-lines {
          position: absolute;
          pointer-events: none;
          opacity: 0;
        }
      `}</style>
    </>
  );
}
