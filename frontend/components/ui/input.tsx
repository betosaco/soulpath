import * as React from "react";

import { cn } from "./utils";
import '@/styles/unified-component-styles.css';

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "unified-form-input",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
