import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";
import '@/styles/unified-component-styles.css';

const buttonVariants = cva(
  "unified-button",
  {
    variants: {
      variant: {
        default: "unified-button--primary",
        destructive: "unified-button--danger",
        outline: "unified-button--outline",
        secondary: "unified-button--secondary",
        ghost: "unified-button--ghost",
        link: "unified-button--ghost underline",
      },
      size: {
        default: "",
        sm: "unified-button--sm",
        lg: "unified-button--lg",
        icon: "unified-button--icon",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
