import { cn } from "@/utils";
import { CSSProperties, FC, ReactNode } from "react";

interface Props {
    children: ReactNode;
    className?: string;
    shimmerWidth?: number;
}

const AnimatedText: FC<Props> = ({
    children,
    className,
    shimmerWidth = 100,
}) => {
    return (
        <p
            style={
                {
                    "--shimmer-width": `${shimmerWidth}px`,
                } as CSSProperties
            }
            className={cn(
                "mx-auto max-w-md text-muted-foreground",

                // Shimmer effect
                "animate-shimmer bg-clip-text bg-no-repeat [background-position:0_0] [background-size:var(--shimmer-width)_100%] [transition:background-position_1s_cubic-bezier(.6,.6,0,1)_infinite]",

                // Shimmer gradient
                "bg-gradient-to-r from-transparent via-black/80 via-50% to-transparent ",

                className,
            )}
        >
            {children}
        </p>
    );
};

export default AnimatedText;
