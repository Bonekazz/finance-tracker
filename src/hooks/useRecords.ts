import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useRecords() {
  const { data, error, isLoading, isValidating } = useSWR("/api/records", fetcher);
  return {
    records: data,
    error, isLoading, isValidating
  }
}
