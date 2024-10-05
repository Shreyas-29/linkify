import { cn } from "@/utils";
import React from 'react';

interface Props {
    className?: string;
    children: React.ReactNode;
}

const MaxWidthWrapper = ({ className, children }: Props) => {
    return (
        <section className={cn(
            "h-full mx-auto w-full max-w-full md:max-w-screen-xl px-4 md:px-12 lg:px-20",
            className,
        )}>
            {children}
        </section>
    )
};

export default MaxWidthWrapper