import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const brutalButtonVariants = cva(
  "cursor-pointer inline-flex items-center justify-center text-center font-heading font-black tracking-wider uppercase transition-all border-[4px] border-[#0F172A] rounded-none focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0 disabled:border-dashed",
  {
    variants: {
      variant: {
        primary:
          "bg-[#FFB800] text-[#0F172A] shadow-[6px_6px_0px_0px_#0F172A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_#0F172A] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none hover:bg-[#FFB800]/90",
        secondary:
          "bg-white text-[#0F172A] shadow-[6px_6px_0px_0px_#0F172A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_#0F172A] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none hover:bg-gray-50",
        dark:
          "bg-[#0F172A] text-white shadow-[6px_6px_0px_0px_#0F172A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_#0F172A] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none hover:bg-[#0F172A]/90",
        blue:
          "bg-[#2563EB] text-white shadow-[6px_6px_0px_0px_#0F172A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_#0F172A] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none hover:bg-[#2563EB]/90",
        hero: 
          "bg-[#FFB800] hover:bg-white text-[#0F172A] shadow-[8px_8px_0px_0px_#0F172A] hover:shadow-[4px_4px_0px_0px_#0F172A] hover:translate-x-[4px] hover:translate-y-[4px] active:shadow-none active:translate-x-[8px] active:translate-y-[8px]",
        ghost:
          "bg-transparent text-[#0F172A] border-dashed hover:border-solid hover:bg-gray-100 shadow-none hover:shadow-[4px_4px_0px_0px_#0F172A] hover:-translate-y-[2px]",
        icon:
          "bg-[#FAFAFA] text-[#0F172A] shadow-[3px_3px_0px_0px_#0F172A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_#0F172A] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none hover:bg-[#FFB800]",
      },
      size: {
        default: "min-h-[3rem] py-2 px-6 md:min-h-[3.5rem] md:px-8 text-lg md:text-xl",
        sm: "min-h-[2.25rem] py-1 px-3 md:min-h-[2.5rem] md:px-4 text-xs md:text-sm border-[3px]",
        lg: "min-h-[3.5rem] py-3 px-6 md:min-h-[4rem] md:px-10 text-lg md:text-2xl w-full",
        xl: "min-h-[4rem] py-4 px-8 md:min-h-[5rem] md:px-16 text-xl md:text-3xl",
        nav: "min-h-[2.5rem] py-2 px-5 md:min-h-[3rem] md:px-6 text-sm md:text-base border-[4px]",
        icon: "h-10 w-10 md:h-12 md:w-12",
        circle: "h-10 w-10 p-0 rounded-full border-[3px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

export interface BrutalButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof brutalButtonVariants> {
  asChild?: boolean
}

const BrutalButton = React.forwardRef<HTMLButtonElement, BrutalButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(brutalButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
BrutalButton.displayName = "BrutalButton"

export { BrutalButton, brutalButtonVariants }
