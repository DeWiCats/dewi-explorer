import React from "react";

import ChartControls from "./ChartControls";
import CustomChartBackground from "./CustomChartBackground";
import { Box, useTheme } from "@mui/material";

export type XYChartProps = {
  width: number;
  height: number;
};

type subDAO = "IOT" | "MOBILE";

export default function Example({ height }: XYChartProps) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        padding: theme.spacing(2),
      }}
    >
      <Box
        sx={{
          overflow: "hidden",
          borderRadius: theme.spacing(4),
        }}
      >
        <ChartControls>
          {({
            accessors,
            animationTrajectory,
            annotationDataKey,
            annotationDatum,
            annotationLabelPosition,
            annotationType,
            colorAccessorFactory,
            config,
            curve,
            data,
            editAnnotationLabelPosition,
            numTicks,
            renderAreaSeries,
            renderAreaStack,
            renderBarGroup,
            renderBarSeries,
            renderBarStack,
            renderGlyph,
            renderGlyphSeries,
            enableTooltipGlyph,
            renderTooltipGlyph,
            renderHorizontally,
            renderLineSeries,
            setAnnotationDataIndex,
            setAnnotationDataKey,
            setAnnotationLabelPosition,
            sharedTooltip,
            showGridColumns,
            showGridRows,
            showHorizontalCrosshair,
            showTooltip,
            showVerticalCrosshair,
            snapTooltipToDatumX,
            snapTooltipToDatumY,
            stackOffset,
            theme,
            xAxisOrientation,
            yAxisOrientation,

            // components are animated or not depending on selection
            Annotation,
            AreaSeries,
            AreaStack,
            Axis,
            BarGroup,
            BarSeries,
            BarStack,
            GlyphSeries,
            Grid,
            LineSeries,
            AnnotationCircleSubject,
            AnnotationConnector,
            AnnotationLabel,
            AnnotationLineSubject,
            Tooltip,
            XYChart,
          }) => (
            <XYChart
              theme={theme}
              xScale={config.x}
              yScale={config.y}
              height={height}
              captureEvents={!editAnnotationLabelPosition}
              onPointerUp={(d) => {
                setAnnotationDataKey(d.key as "IOT" | "MOBILE");
                setAnnotationDataIndex(d.index);
              }}
            >
              <CustomChartBackground />
              <Grid
                key={`grid-${animationTrajectory}`} // force animate on update
                rows={showGridRows}
                columns={showGridColumns}
                animationTrajectory={animationTrajectory}
                numTicks={numTicks}
              />
              {renderBarStack && (
                <BarStack offset={stackOffset}>
                  <BarSeries
                    dataKey="MOBILE"
                    data={data}
                    xAccessor={accessors.x["MOBILE"]}
                    yAccessor={accessors.y["MOBILE"]}
                  />
                  <BarSeries
                    dataKey="IOT"
                    data={data}
                    xAccessor={accessors.x["IOT"]}
                    yAccessor={accessors.y["IOT"]}
                  />
                </BarStack>
              )}
              {renderBarGroup && (
                <BarGroup>
                  <BarSeries
                    dataKey="MOBILE"
                    data={data}
                    xAccessor={accessors.x["MOBILE"]}
                    yAccessor={accessors.y["MOBILE"]}
                    colorAccessor={colorAccessorFactory("MOBILE")}
                  />
                  <BarSeries
                    dataKey="IOT"
                    data={data}
                    xAccessor={accessors.x["IOT"]}
                    yAccessor={accessors.y["IOT"]}
                    colorAccessor={colorAccessorFactory("IOT")}
                  />
                </BarGroup>
              )}
              {renderBarSeries && (
                <BarSeries
                  dataKey="MOBILE"
                  data={data}
                  xAccessor={accessors.x["MOBILE"]}
                  yAccessor={accessors.y["MOBILE"]}
                  colorAccessor={colorAccessorFactory("MOBILE")}
                />
              )}
              {renderAreaSeries && (
                <>
                  <AreaSeries
                    dataKey="MOBILE"
                    data={data}
                    xAccessor={accessors.x["MOBILE"]}
                    yAccessor={accessors.y["MOBILE"]}
                    fillOpacity={0.4}
                    curve={curve}
                  />
                  <AreaSeries
                    dataKey="IOT"
                    data={data}
                    xAccessor={accessors.x["IOT"]}
                    yAccessor={accessors.y["IOT"]}
                    fillOpacity={0.4}
                    curve={curve}
                  />
                </>
              )}
              {renderAreaStack && (
                <AreaStack
                  curve={curve}
                  offset={stackOffset}
                  renderLine={stackOffset !== "wiggle"}
                >
                  <AreaSeries
                    dataKey="MOBILE"
                    data={data}
                    xAccessor={accessors.x["MOBILE"]}
                    yAccessor={accessors.y["MOBILE"]}
                    fillOpacity={0.4}
                  />
                  <AreaSeries
                    dataKey="IOT"
                    data={data}
                    xAccessor={accessors.x["IOT"]}
                    yAccessor={accessors.y["IOT"]}
                    fillOpacity={0.4}
                  />
                </AreaStack>
              )}
              {renderLineSeries && (
                <>
                  {!renderBarSeries && (
                    <LineSeries
                      dataKey="MOBILE"
                      data={data}
                      xAccessor={accessors.x["MOBILE"]}
                      yAccessor={accessors.y["MOBILE"]}
                      curve={curve}
                    />
                  )}
                  <LineSeries
                    dataKey="IOT"
                    data={data}
                    xAccessor={accessors.x["IOT"]}
                    yAccessor={accessors.y["IOT"]}
                    curve={curve}
                  />
                </>
              )}
              {renderGlyphSeries && (
                <GlyphSeries
                  dataKey="IOT"
                  data={data}
                  xAccessor={accessors.x["IOT"]}
                  yAccessor={accessors.y["IOT"]}
                  renderGlyph={renderGlyph}
                  colorAccessor={colorAccessorFactory("IOT")}
                />
              )}
              <Axis
                key={`time-axis-${animationTrajectory}-${renderHorizontally}`}
                orientation={
                  renderHorizontally ? yAxisOrientation : xAxisOrientation
                }
                numTicks={numTicks}
                animationTrajectory={animationTrajectory}
              />
              <Axis
                key={`temp-axis-${animationTrajectory}-${renderHorizontally}`}
                label={"veHNT"}
                orientation={
                  renderHorizontally ? xAxisOrientation : yAxisOrientation
                }
                numTicks={numTicks}
                animationTrajectory={animationTrajectory}
                // values don't make sense in stream graph
                tickFormat={stackOffset === "wiggle" ? () => "" : undefined}
              />
              {annotationDataKey && annotationDatum && (
                <Annotation
                  dataKey={annotationDataKey}
                  datum={annotationDatum}
                  dx={annotationLabelPosition.dx}
                  dy={annotationLabelPosition.dy}
                  editable={editAnnotationLabelPosition}
                  canEditSubject={false}
                  onDragEnd={({ dx, dy }) =>
                    setAnnotationLabelPosition({ dx, dy })
                  }
                >
                  <AnnotationConnector />
                  {annotationType === "circle" ? (
                    <AnnotationCircleSubject />
                  ) : (
                    <AnnotationLineSubject />
                  )}
                  <AnnotationLabel
                    title={annotationDataKey}
                    subtitle={`${annotationDatum.epoch}, ${
                      annotationDataKey === "IOT"
                        ? annotationDatum.iot_vehnt_at_epoch_start
                        : annotationDatum.mobile_vehnt_at_epoch_start
                    }`}
                    width={135}
                    backgroundProps={{
                      stroke: theme.gridStyles.stroke,
                      strokeOpacity: 0.5,
                      fillOpacity: 0.8,
                    }}
                  />
                </Annotation>
              )}
              {showTooltip && (
                <Tooltip
                  showHorizontalCrosshair={showHorizontalCrosshair}
                  showVerticalCrosshair={showVerticalCrosshair}
                  snapTooltipToDatumX={snapTooltipToDatumX}
                  snapTooltipToDatumY={snapTooltipToDatumY}
                  showDatumGlyph={
                    (snapTooltipToDatumX || snapTooltipToDatumY) &&
                    !renderBarGroup
                  }
                  showSeriesGlyphs={sharedTooltip && !renderBarGroup}
                  renderGlyph={
                    enableTooltipGlyph ? renderTooltipGlyph : undefined
                  }
                  renderTooltip={({ tooltipData, colorScale }) => (
                    <>
                      {/** date */}
                      {(tooltipData?.nearestDatum?.datum &&
                        accessors.date(tooltipData?.nearestDatum?.datum)) ||
                        "No date"}
                      <br />
                      <br />
                      {/** temperatures */}
                      {(
                        (sharedTooltip
                          ? Object.keys(tooltipData?.datumByKey ?? {})
                          : [tooltipData?.nearestDatum?.key]
                        ).filter((subdao) => subdao) as subDAO[]
                      ).map((subdao) => {
                        const veHNT =
                          tooltipData?.nearestDatum?.datum &&
                          accessors[renderHorizontally ? "x" : "y"][subdao](
                            tooltipData?.nearestDatum?.datum
                          );

                        return (
                          <div key={subdao}>
                            <em
                              style={{
                                color: colorScale?.(subdao),
                                textDecoration:
                                  tooltipData?.nearestDatum?.key === subdao
                                    ? "underline"
                                    : undefined,
                              }}
                            >
                              {subdao}
                            </em>{" "}
                            {veHNT == null || Number.isNaN(veHNT)
                              ? "–"
                              : `${veHNT.toLocaleString()} veHNT`}
                          </div>
                        );
                      })}
                    </>
                  )}
                />
              )}
            </XYChart>
          )}
        </ChartControls>
      </Box>
    </Box>
  );
}
