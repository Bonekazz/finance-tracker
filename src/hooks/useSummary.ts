import useSWR from 'swr';

// Fetcher function for SWR
const fetcher = (url: string) => fetch(url).then(res => {
  if (!res.ok) throw new Error('Failed to fetch summary');
  return res.json();
});

export interface SummaryItem {
  date: string;
  income: number;
  expense: number;
}

export interface SummaryResponse {
  totalIncome: number;
  totalExpense: number;
  summaryData: SummaryItem[];
}

export function useSummary() {
  const { data, error, isLoading, mutate } = useSWR<SummaryResponse>('/api/summary', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60_000, // 1 minute
  });

  return {
    data,
    error,
    isLoading,
    mutate,
  };
} 