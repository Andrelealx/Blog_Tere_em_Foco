import { Skeleton } from "@/components/ui";

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-10">
      <Skeleton className="h-12 w-2/3" />
      <Skeleton className="h-64 w-full" />
      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    </div>
  );
}
