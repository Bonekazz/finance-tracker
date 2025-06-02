'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { format } from 'date-fns'
import { subDays } from 'date-fns'
import { DateRange } from 'react-day-picker'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon } from 'lucide-react'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { formatDateToBR, formatToBRL } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

const fetcher = (url: string) => fetch(url).then((res) => { 
  const data = res.json();
  console.log("data: ", data);
  return data;
});

const chartConfig = {
  income: {
    label: "entradas",
    color: "var(--chart-1)",
  },
  expense: {
    label: "saídas",
    color: "var(--chart-2)",
  },
};

export default function DashboardPage2() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  })

  const from = date?.from?.toISOString()
  const to = date?.to?.toISOString()

  const { data, isLoading } = useSWR(
    date?.from && date?.to ? `/api/summary?from=${from}&to=${to}` : null,
    fetcher
  )

  return (
    <div className="p-6 space-y-6 w-full">
      <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="mt-2 md:mt-0">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>{formatDateToBR(date.from)} - {formatDateToBR(date.to)}</>
                ) : (
                  formatDateToBR(date.from)
                )
              ) : (
                <span>Escolha uma data</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="w-full grid grid-cols-3 gap-7">
        <Card className="">
          <CardContent className="flex flex-col gap-2">
            <p className="text-muted-foreground">Saldo Total</p>
            { isLoading ?  <Skeleton className="h-[30px] w-[100px] rounded-md" /> : <p className="text-3xl font-semibold">{formatToBRL(data?.totalBalance)}</p>}
          </CardContent>
        </Card>         

        <Card className="">
          <CardContent className="flex flex-col gap-2">
            <p className="text-muted-foreground">Receita Total</p>
            { isLoading ?  <Skeleton className="h-[30px] w-[100px] rounded-md" /> : <p className="text-3xl font-semibold">{formatToBRL(data?.totalIncome)}</p>}
          </CardContent>
        </Card>

        <Card className="">
          <CardContent className="flex flex-col gap-2">
            <p className="text-muted-foreground">Despesa Total</p>
            { isLoading ?  <Skeleton className="h-[30px] w-[100px] rounded-md" /> : <p className="text-3xl font-semibold">{formatToBRL(data?.totalExpense)}</p>}
          </CardContent>
        </Card>
      </div>

      <div className="w-full flex gap-5">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-3xl font-semibold">Receitas vs Despesas</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
             <ChartContainer className="w-full h-full" config={chartConfig}>
              <LineChart
                accessibilityLayer
                data={data?.chartData ?? []}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <YAxis stroke="#888888" fontSize={12} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => formatDateToBR(new Date(value))}
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <Line
                  dataKey="income"
                  type="monotone"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  dataKey="expense"
                  type="monotone"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>         
          </CardContent>
        </Card>
      </div>

    </div>
  )
}
