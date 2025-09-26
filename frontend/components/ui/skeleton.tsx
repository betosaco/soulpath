import { cn } from "./utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-md", className)}
      style={{ background: 'color-mix(in srgb, var(--color-text-primary) 8%, transparent)' }}
      {...props}
    />
  );
}

export { Skeleton };
