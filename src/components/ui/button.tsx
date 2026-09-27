import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-transparent text-sm font-medium outline-none transition-[background-color,border-color,color,box-shadow,transform,opacity] duration-200 ease-out active:scale-[0.98] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100 focus-visible:border-v2-neutral-500 focus-visible:ring-[3px] focus-visible:ring-v2-neutral-400/25 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-v2-neutral-600 text-v2-neutral-100 shadow-sm hover:bg-v2-neutral-500 hover:shadow-md",
        destructive:
          "border-destructive bg-destructive text-white shadow-sm hover:bg-destructive/90 focus-visible:border-destructive focus-visible:ring-destructive/25",
        outline:
          "border-v2-neutral-300 bg-v2-neutral-100 text-v2-neutral-600 shadow-sm hover:border-v2-neutral-400 hover:bg-v2-neutral-200/60",
        secondary:
          "bg-v2-neutral-200 text-v2-neutral-600 hover:bg-v2-neutral-300",
        ghost:
          "text-v2-neutral-500 shadow-none hover:bg-v2-neutral-200/60 hover:text-v2-neutral-600",
        link:
          "h-auto rounded-none border-0 px-0 py-0 text-v2-neutral-600 underline-offset-4 shadow-none hover:underline active:scale-100",
      },
      size: {
        default: "h-10 px-4 py-2 has-[>svg]:px-3.5",
        sm: "h-9 gap-1.5 rounded-lg px-3 has-[>svg]:px-2.5",
        lg: "h-12 rounded-xl px-6 text-base has-[>svg]:px-5",
        icon: "size-10 p-0",
        "icon-sm": "size-8 rounded-lg p-0",
        "icon-lg": "size-12 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants, type ButtonProps }
