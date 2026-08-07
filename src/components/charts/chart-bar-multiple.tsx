"use client"

import { TrendingUp, BarChart as BarChartIcon } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A multiple bar chart styled with Neo-Brutalism"

const chartConfig = {
  score: {
    label: "Score",
    color: "#0F172A", 
  },
  case001: {
    label: "Case 001",
    color: "#FF4A4A",
  },
  case002: {
    label: "Case 002",
    color: "#00E599",
  },
  case003: {
    label: "Case 003",
    color: "#4A90E2",
  },
} satisfies ChartConfig

export function ChartBarMultiple({ c1, c2, c3 }: { c1: number, c2: number, c3: number }) {
  // Pass dynamic colors using CSS variables that shadcn/chart understands
  const chartData = [
    { case: "TEXT", score: c1, fill: "var(--color-case001)" },
    { case: "PHOTO", score: c2, fill: "var(--color-case002)" },
    { case: "VIDEO", score: c3, fill: "var(--color-case003)" },
  ]

  const maxTotalScore = 500;
  const avgPercent = Math.round(((c1 + c2 + c3) / 1500) * 100);

  return (
    <Card className="bg-white border-[4px] border-[#0F172A] shadow-[8px_8px_0px_0px_#0F172A] rounded-none">
      <CardHeader className="border-b-[4px] border-[#0F172A] pb-4 bg-gray-50">
        <CardTitle className="font-heading font-black uppercase text-xl text-[#0F172A] flex items-center gap-2">
          <BarChartIcon className="w-5 h-5" strokeWidth={3} /> Medium Comparison
        </CardTitle>
        <CardDescription className="font-mono text-[#0F172A]/70 uppercase font-bold text-xs">
          Target: 500 Pts per Case
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData} margin={{ top: 20 }}>
            <CartesianGrid vertical={false} stroke="#0F172A" strokeDasharray="4 4" />
            <XAxis
              dataKey="case"
              tickLine={false}
              tickMargin={10}
              axisLine={{ stroke: '#0F172A', strokeWidth: 3 }}
              className="font-mono font-bold text-sm"
              tick={{ fill: '#0F172A' }}
            />
            <ChartTooltip
              cursor={{ fill: 'rgba(15, 23, 42, 0.05)' }}
              content={<ChartTooltipContent hideLabel className="border-2 border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] font-mono font-bold rounded-none" />}
            />
            <Bar 
              dataKey="score" 
              radius={0}
              stroke="#0F172A"
              strokeWidth={3}
              minPointSize={5}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm border-t-[4px] border-[#0F172A] pt-4 bg-[#FFB800]">
        <div className="flex gap-2 font-bold font-mono text-[#0F172A] uppercase text-xs">
          Overall Hit Rate: {avgPercent}% <TrendingUp className="h-4 w-4" strokeWidth={3} />
        </div>
        <div className="text-[#0F172A]/80 font-bold leading-none text-xs">
          Showing total points for all 3 cases
        </div>
      </CardFooter>
    </Card>
  )
}
