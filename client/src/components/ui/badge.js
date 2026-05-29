import React from "react";
import { cn } from "../../utils/cn";
export const Badge = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
    const variants = {
        default: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
        secondary: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300",
        destructive: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
        outline: "border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300",
    };
    return (<div ref={ref} className={cn("inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium", variants[variant], className)} {...props}/>);
});
Badge.displayName = "Badge";
