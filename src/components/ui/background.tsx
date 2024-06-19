// import React from 'react'

// const background = () => {
//     return (
//         <div className="w-screen min-h-screen fixed z[1] flex justify-center pt-32 px-6 pb-40 pointer-events-none">
//             <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]"></div>
//         </div>
//     )
// };

// export default background
import { cn } from "@/utils";
import { useId } from "react";

interface Props {
    children: React.ReactNode;
    width?: any;
    height?: any;
    x?: any;
    y?: any;
    squares?: Array<[x: number, y: number]>;
    strokeDasharray?: any;
    className?: string;
    [key: string]: any;
}

export function Background({
    children,
    width = 40,
    height = 40,
    x = -1,
    y = -1,
    strokeDasharray = 0,
    squares,
    className,
    ...props
}: Props) {
    const id = useId();

    return (
        <div className="flex min-h-screen flex-col w-full relative">
            <div className="[mask-image:radial-gradient(500px_circle_at_center,white,transparent)] w-full h-full absolute inset-0"></div>
            <div className="min-h-screen absolute inset-0 w-full">
                <svg
                    aria-hidden="true"
                    className={cn(
                        "pointer-events-none w-full h-full fill-neutral-400/30 stroke-neutral-400/30",
                        className,
                    )}
                    {...props}
                >
                    <defs>
                        <pattern
                            id={id}
                            width={width}
                            height={height}
                            patternUnits="userSpaceOnUse"
                            x={x}
                            y={y}
                        >
                            <path
                                d={`M.5 ${height}V.5H${width}`}
                                fill="none"
                                strokeDasharray={strokeDasharray}
                            />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />
                    {squares && (
                        <svg x={x} y={y} className="overflow-visible">
                            {squares.map(([x, y]) => (
                                <rect
                                    strokeWidth="0"
                                    key={`${x}-${y}`}
                                    width={width - 1}
                                    height={height - 1}
                                    x={x * width + 1}
                                    y={y * height + 1}
                                />
                            ))}
                        </svg>
                    )}
                </svg>
            </div>
            {children}
        </div>
    );
}

export default Background;
