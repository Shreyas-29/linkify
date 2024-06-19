import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95 transition-all",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90 primary",
        purple: "bg-purple-500 text-white hover:bg-purple-500/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        subtle: "bg-subtle text-subtle-foreground hover:bg-subtle/80",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground hover:border-border",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-8 w-8",
        iconlg: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
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

export { Button, buttonVariants };

// export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
//   children?: React.ReactNode;
//   variant?: "primary" | "ghost" | "subtle" | "outline" | "destructive";
//   isLoading?: boolean;
//   icon?: React.ReactNode;
//   size?: "default" | "sm" | "lg" | "icon" | "iconlg";
// };
// export const buttonVariants = cva(
//   "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95 relative",
//   {
//     variants: {
//       variant: {
//         primary: "bg-primary text-primary-foreground hover:bg-primary/90",
//         ghost: "hover:bg-accent hover:text-accent-foreground",
//         subtle: "bg-subtle text-foreground/80 hover:bg-subtle/80",
//         outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground hover:border-neutral-500",
//         destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
//       },
//       size: {
//         default: "h-9 px-4 py-2",
//         sm: "h-8 rounded-md px-3",
//         lg: "h-11 rounded-md px-8",
//         icon: "h-8 w-8",
//         iconlg: "h-10 w-10",
//       },
//     },
//     defaultVariants: {
//       variant: "primary",
//       size: "default",
//     },
//   }
// )
// const Button = ({
//   icon,
//   children,
//   isLoading = false,
//   variant = "primary",
//   size = "default",
//   ...props
// }: ButtonProps) => {
//   return (
//     <button
//       className={cn(
//         props.className,
//         "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95 relative",
//         {
//           primary: "bg-primary text-primary-foreground hover:bg-primary/90",
//           ghost: "hover:bg-accent hover:text-accent-foreground",
//           subtle: "bg-subtle text-foreground/80 hover:bg-subtle/80",
//           outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground hover:border-neutral-500",
//           destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
//         }[variant],
//         {
//           default: "h-9 px-4 py-2",
//           sm: "h-8 rounded-md px-3",
//           lg: "h-11 rounded-md px-8",
//           icon: "h-8 w-8",
//           iconlg: "h-10 w-10",
//         }[size]
//       )}
//       {...props}
//     >
//       {isLoading ? "Loading" : icon ? icon : null}
//       {children}
//     </button>
//   );
// };

// export default Button;
