"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Toggle as TogglePrimitive } from "radix-ui"

const toggleVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center whitespace-nowrap font-medium outline-none transition-[background-color,border-color,color,box-shadow,transform,opacity] duration-200 ease-out active:scale-[0.98] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100 focus-visible:border-v2-neutral-500 focus-visible:ring-[3px] focus-visible:ring-v2-neutral-400/25 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 select-none",
  {
    variants: {
      variant: {
        default:
          "border border-transparent bg-transparent text-v2-neutral-400 hover:bg-v2-neutral-200/70 hover:text-v2-neutral-600 data-[state=on]:bg-v2-neutral-500 data-[state=on]:text-v2-neutral-100 data-[state=on]:shadow-sm data-[state=on]:font-semibold",
        outline:
          "border border-v2-neutral-300 bg-v2-neutral-100 text-v2-neutral-500 shadow-xs hover:border-v2-neutral-400 hover:bg-v2-neutral-200 hover:text-v2-neutral-600 data-[state=on]:border-v2-neutral-500 data-[state=on]:bg-v2-neutral-500 data-[state=on]:text-v2-neutral-100 data-[state=on]:shadow-sm data-[state=on]:font-semibold",
        subtle:
          "border border-transparent bg-transparent text-v2-neutral-400 hover:bg-v2-neutral-200/60 hover:text-v2-neutral-600 data-[state=on]:border-v2-neutral-300/80 data-[state=on]:bg-v2-neutral-100 data-[state=on]:text-v2-neutral-600 data-[state=on]:shadow-xs data-[state=on]:font-semibold",
        secondary:
          "border border-transparent bg-v2-neutral-200 text-v2-neutral-500 hover:bg-v2-neutral-300 hover:text-v2-neutral-600 data-[state=on]:bg-v2-neutral-500 data-[state=on]:text-v2-neutral-100 data-[state=on]:shadow-sm",
        ghost:
          "border border-transparent bg-transparent text-v2-neutral-400 hover:bg-v2-neutral-200/60 hover:text-v2-neutral-600 data-[state=on]:bg-v2-neutral-200 data-[state=on]:text-v2-neutral-600 data-[state=on]:font-semibold",
      },
      size: {
        default: "h-10 min-w-10 gap-2 rounded-xl px-3.5 text-sm has-[>svg]:px-3",
        sm: "h-8.5 min-w-8.5 gap-1.5 rounded-lg px-2.5 text-xs has-[>svg]:px-2",
        lg: "h-12 min-w-12 gap-2.5 rounded-xl px-5 text-base has-[>svg]:px-4",
        icon: "size-10 rounded-xl p-0",
        "icon-sm": "size-8.5 rounded-lg p-0",
        "icon-lg": "size-12 rounded-xl p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Toggle({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Toggle, toggleVariants }
