
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none text-sm font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "cyber-button relative before:z-[-1] before:inset-0 before:absolute before:transition-all text-cyber-primary border-2 border-cyber-primary shadow-[0_0_10px_rgba(0,243,255,0.5)]",
        destructive:
          "relative border-2 border-destructive text-destructive shadow-[0_0_10px_rgba(239,68,68,0.5)] hover:shadow-[0_0_15px_rgba(239,68,68,0.7)]",
        outline:
          "relative border-2 border-cyber-primary/50 text-cyber-primary/80 hover:border-cyber-primary hover:text-cyber-primary shadow-[0_0_5px_rgba(0,243,255,0.3)] hover:shadow-[0_0_10px_rgba(0,243,255,0.5)]",
        secondary:
          "relative border-2 border-cyber-secondary text-cyber-secondary shadow-[0_0_10px_rgba(255,0,160,0.5)] hover:shadow-[0_0_15px_rgba(255,0,160,0.7)]",
        ghost: "text-cyber-primary hover:bg-cyber-primary/10",
        link: "text-cyber-primary underline-offset-4 hover:underline",
        cyber: "relative inline-flex overflow-hidden bg-transparent border-2 border-cyber-primary px-6 py-2 text-cyber-primary shadow-[0_0_10px_rgba(0,243,255,0.5)] hover:shadow-[0_0_15px_rgba(0,243,255,0.8)] before:absolute before:inset-0 before:border-t-2 before:border-cyber-primary/50 before:bg-cyber-primary/10 before:-translate-x-full hover:before:translate-x-0 before:transition-transform before:duration-300",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8 [&_svg]:size-3.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
