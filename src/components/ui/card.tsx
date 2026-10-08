import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const cardVariants = cva(
  "group/card flex flex-col overflow-hidden border text-v2-neutral-600 transition-[background-color,border-color,box-shadow] duration-200",
  {
    variants: {
      variant: {
        default:
          "border-v2-neutral-200 bg-v2-neutral-100 shadow-[0_10px_35px_rgba(53,53,54,0.08)]",
        elevated:
          "border-v2-neutral-200 bg-v2-neutral-100 shadow-[0_18px_55px_rgba(53,53,54,0.14)]",
        subtle:
          "border-v2-neutral-200/70 bg-v2-neutral-200/65 shadow-none",
        outline:
          "border-v2-neutral-300 bg-v2-neutral-100 shadow-none",
        dark:
          "border-v2-neutral-400 bg-v2-neutral-500 text-v2-neutral-100 shadow-[0_18px_55px_rgba(8,8,8,0.14)]",
      },
      size: {
        sm: "gap-4 rounded-xl py-4",
        default: "gap-6 rounded-2xl py-6",
        lg: "gap-7 rounded-3xl py-7",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

type CardProps = React.ComponentProps<"div"> &
  VariantProps<typeof cardVariants>

function Card({ className, variant, size, ...props }: CardProps) {
  return (
    <div
      data-slot="card"
      data-variant={variant ?? "default"}
      data-size={size ?? "default"}
      className={cn(cardVariants({ variant, size }), className)}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] group-data-[size=sm]/card:px-4 group-data-[size=lg]/card:px-7",
        className,
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "text-base font-semibold leading-snug tracking-[-0.02em] text-v2-neutral-600 group-data-[variant=dark]/card:text-v2-neutral-100",
        className,
      )}
      {...props}
    />
  )
}

function CardDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn(
        "text-sm leading-5 text-v2-neutral-400 group-data-[variant=dark]/card:text-v2-neutral-300",
        className,
      )}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className,
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn(
        "px-6 group-data-[size=sm]/card:px-4 group-data-[size=lg]/card:px-7",
        className,
      )}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center px-6 [.border-t]:pt-6 group-data-[size=sm]/card:px-4 group-data-[size=sm]/card:[.border-t]:pt-4 group-data-[size=lg]/card:px-7 group-data-[size=lg]/card:[.border-t]:pt-7 group-data-[variant=dark]/card:border-v2-neutral-400",
        className,
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  cardVariants,
  type CardProps,
}
