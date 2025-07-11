"use client";

import { useUser } from "@clerk/nextjs";
import { ProfileButton } from "./profile-button";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { useSummary } from "@/hooks/useSummary";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const chartConfig = {
  income: {
    label: "Ganhos",
    color: "var(--chart-1)",
  },
  expense: {
    label: "Despesas",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function Page() {
  const { user, isLoaded } = useUser();
  const { data, error, isLoading } = useSummary();

  // Prepare chart data for recharts
  const chartData = data?.summaryData?.map(item => ({
    day: new Date(item.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
    income: item.income,
    expense: item.expense,
  })) || [];

  const totalIncome = data?.totalIncome || 0;
  const totalExpense = data?.totalExpense || 0;
  const balance = totalIncome - totalExpense;

  useEffect(() => {
    if (chartData) console.log(chartData);
  }, [chartData]);

  return (
    <div className="w-full h-full flex flex-col gap-[28px]">
      <header className="w-full flex justify-between items-center">
        <h1 className="text-[34px] font-semibold max-w-[207px] leading-[35px]">Resumo Deste Mês</h1>
        <ProfileButton imageUrl={isLoaded && user!.imageUrl || undefined} />
      </header>

      {/* SALDO */}
      <div className="flex flex-col gap-[10px] px-[17px] py-[28px] rounded-2xl border border-[#CACACA]">
        <div className="flex flex-col">
          <p className="text-[20px] font-medium">Saldo</p>
          { isLoading ? 
            <Skeleton className="w-full h-fit rounded-xl">
              <p className="text-[36px] font-bold mt-[-10px] invisible">33</p>
            </Skeleton> : <p id="balance" className="text-[36px] font-bold mt-[-10px]">{formatCurrency(balance)}</p> 
          }
        </div>
        <div className="w-full flex gap-[38px]">
          <div className="flex flex-col gap-[-5px]">
            <p id="income" className="text-[15px] font-light">Ganhos</p>
            { isLoading ? 
              <Skeleton className="w-full h-fit rounded-xl">
                <p className="text-[36px] font-bold mt-[-10px] invisible">33</p>
              </Skeleton> : <p id="income-amount" className="text-[16px] font-bold text-[#12A423]">{formatCurrency(totalIncome)}</p> 
            }
          </div>
          <div className="flex flex-col gap-[-5px]">
            <p id="expense" className="text-[15px] font-light">Despesas</p>
            { isLoading ? 
              <Skeleton className="w-full h-fit rounded-xl">
                <p className="text-[36px] font-bold mt-[-10px] invisible">33</p>
              </Skeleton> : <p id="expense-amount" className="text-[16px] font-bold text-[#A41212]">{formatCurrency(totalExpense)}</p> 
            }
          </div>
        </div>
      </div>

      {/* CHART */}
      <ChartContainer config={chartConfig} className="w-full p-0">
        <LineChart
          accessibilityLayer
          data={chartData}
        >
          <CartesianGrid vertical={false} />
          <YAxis 
            scale="auto"
            hide={true}
            axisLine={false} 
            tickLine={false} 
            width={30}
            className="p-0 text-xs"
          />
          <XAxis
            dataKey="day"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Line
            dataKey="income"
            type="monotone"
            stroke="#45FF51"
            strokeWidth={2}
            dot={false}
          />
          <Line
            dataKey="expense"
            type="monotone"
            stroke="#FF5555"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ChartContainer>

      {error && (
        <div className="text-red-500 text-center">Erro ao carregar dados do resumo.</div>
      )}
    </div>
  )
}
