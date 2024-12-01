/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Zoom } from "react-awesome-reveal";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface MainChartTypes {
  data: {
    name: string;
    uv: number;
  }[];
}

// const CustomBar = (props: any) => {
//   const { x, y, width, height, fill } = props;
//   return (
//     <g>
//       <path
//         d={`M${x},${y + height}
// 				 L${x},${y + 8}
// 				 Q${x},${y} ${x + 8},${y}
// 				 L${x + width - 8},${y}
// 				 Q${x + width},${y} ${x + width},${y + 8}
// 				 L${x + width},${y + height} Z`}
//         fill={fill}
//       />
//     </g>
//   );
// };
function MainChart({ data }: MainChartTypes) {
  // const isMobileView = useMediaQuery("(max-width: 640px)");
  // const isTabletView = useMediaQuery("(max-width: 840px)");

  return (
    <Zoom>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer height='100%' width='100%'>
          <LineChart
            data={data}
            height={300}
            margin={{
              top: 5,
              right: 30,
              left: 0,
              bottom: 5,
            }}
            width={500}
          >
            <CartesianGrid
              horizontal={false}
              stroke='#E4E4E7'
              vertical={false}
            />
            <XAxis
              axisLine={{ stroke: "#E4E4E7", strokeWidth: 0.5 }}
              dataKey='name'
              tick={{ fontSize: 12 }}
              tickLine={false}
            />
            <YAxis
              axisLine={{ stroke: "#E4E4E7", strokeWidth: 0.5 }}
              tick={{ fontSize: 12 }}
              tickLine={false}
            />
            <Tooltip />

            <Line
              activeDot={{ r: 8 }}
              dataKey='pv'
              stroke='#8884d8'
              strokeWidth={3}
              type='monotone'
            />
            <Line
              dataKey='uv'
              stroke='#82ca9d'
              strokeWidth={3}
              type='monotone'
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Zoom>
  );
}

export default MainChart;
