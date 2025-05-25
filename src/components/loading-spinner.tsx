import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  className?: string
}

export function LoadingSpinner({ className }: LoadingSpinnerProps) {
  return <div className={cn("animate-spin rounded-full border-2 border-muted border-t-primary h-3 w-3", className)} />
}

