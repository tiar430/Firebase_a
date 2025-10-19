"use client";

import * as React from "react";
import { Pie, PieChart, Cell } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import type { Program } from "@/lib/types";

interface DashboardChartProps {
  programs: Program[];
}

const chartColors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd"
];

export function DashboardChart({ programs }: DashboardChartProps) {
  const chartData = React.useMemo(() => {
    const brandCounts = programs.reduce((acc, program) => {
      acc[program.brand] = (acc[program.brand] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(brandCounts)
      .map(([brand, count]) => ({
        name: brand,
        value: count,
      }))
      .sort((a, b) => b.value - a.value);
  }, [programs]);

  const chartConfig = React.useMemo(() => {
    return chartData.reduce((acc, item, index) => {
      acc[item.name] = {
        label: item.name,
        color: chartColors[index % chartColors.length],
      };
      return acc;
    }, {} as any);
  }, [chartData]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle className="font-headline">Total Program by Brand</CardTitle>
        <CardDescription>Distribution of active, pending, and ended programs</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {chartData.length > 0 ? (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[300px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                strokeWidth={5}
                >
                {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={chartConfig[entry.name]?.color} />
                ))}
              </Pie>
              <ChartLegend
                content={<ChartLegendContent nameKey="name" />}
                className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
              />
            </PieChart>
          </ChartContainer>
        ) : (
          <div className="flex h-[300px] w-full items-center justify-center">
            <p className="text-muted-foreground">No data to display</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
