import { buildChartTheme } from "@visx/xychart";

export default buildChartTheme({
  backgroundColor: "#212121",
  colors: ["#009FF9", "#27EE76", "#fff", "red"],
  gridColor: "#fff",
  gridColorDark: "#fff",
  gridStyles: {
    stroke: "#fcfcfa9A",
    strokeWidth: 1,
    strokeDasharray: "4,4",
  },
  svgLabelBig: { fill: "#fff" },
  tickLength: 8,
});
