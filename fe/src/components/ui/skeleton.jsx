import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-200/50", className)} // Saya pakai gray-200 agar aman jika 'bg-muted' belum di-setup
      {...props}
    />
  );
}

export { Skeleton };