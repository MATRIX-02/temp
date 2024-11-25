'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from '@/components/ui/chart';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  XAxis,
  YAxis
} from 'recharts';
import { ActionButtons } from './actions/action-buttons';

const chartData = [
  { intensity: 'Low', items: 15 },
  { intensity: 'Medium', items: 45 },
  { intensity: 'Healthy', items: 70 },
  { intensity: 'Dead', items: 5 },
  { intensity: 'Fast Moving', items: 70 },
  { intensity: 'Slow Moving', items: 45 }
];

const chartConfig = {
  items: {
    label: 'Items',
    color: 'hsl(var(--chart-1))'
  }
} satisfies ChartConfig;

type RenderCustomizedLabelArgs = {
  x: number;
  y: number;
  index: number;
};

const renderCustomizedLabel = (props: RenderCustomizedLabelArgs) => {
  const { x, y, index } = props;
  const radius = 10;

  return (
    <g>
      <text
        x={x + 10}
        y={y - radius}
        fill={colors[index]}
        textAnchor="middle"
        dominantBaseline="middle"
        fontWeight={700}
      >
        {chartData[index].items}
      </text>
    </g>
  );
};

const colors = [
  '#DE4F4F',
  '#CB880E',
  '#2A9D90',
  '#B8B8B8',
  '#2A9D90',
  '#F4A362'
];

export function StockStatus() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center justify-between">
            <span>Stock Status</span>
            <ActionButtons />
          </div>
        </CardTitle>
        <CardDescription>By Number of Items in Stock</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[310px] w-full"
        >
          <BarChart accessibilityLayer data={chartData}>
            <defs>
              {/* Pattern for Fast Moving */}
              <pattern
                id="pattern-fast"
                patternUnits="userSpaceOnUse"
                width="10"
                height="10"
                patternTransform="rotate(45)"
              >
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="10"
                  stroke="#2A9D90"
                  strokeWidth="8"
                />
              </pattern>

              {/* Pattern for Slow Moving */}
              <pattern
                id="pattern-slow"
                patternUnits="userSpaceOnUse"
                width="10"
                height="10"
                patternTransform="rotate(45)"
              >
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="10"
                  stroke="#F4A362"
                  strokeWidth="8"
                />
              </pattern>
            </defs>
            <CartesianGrid />
            <XAxis dataKey="intensity" tickMargin={10} />
            <YAxis dataKey="items" tickMargin={10} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="items" fill="var(--color-items)" radius={4}>
              <LabelList
                dataKey="name"
                content={(props) =>
                  renderCustomizedLabel(props as RenderCustomizedLabelArgs)
                }
              />
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.intensity === 'Fast Moving'
                      ? 'url(#pattern-fast)'
                      : entry.intensity === 'Slow Moving'
                      ? 'url(#pattern-slow)'
                      : colors[index % 20]
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
        <div className="mt-4 text-center text-sm text-gray-600">
          Showing 5 suppliers • Last 30 days
        </div>
      </CardContent>
    </Card>
  );
}
