"use client";

import { cn } from "@/utils";
import { Check, Copy, LucideIcon } from "lucide-react";
import React, { useState } from 'react'
import { toast } from "sonner";

interface Props {
    text: string;
    className?: string;
    icon?: LucideIcon;
}

const CopyButton = ({ text, className, icon }: Props) => {

    const [isCopied, setIsCopied] = useState<boolean>(false);

    const Comp = icon || Copy;

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setIsCopied(true);
        navigator.clipboard.writeText(text).then(() => {
            toast.success("Copied to clipboard!");
        });
        setTimeout(() => {
            setIsCopied(false);
        }, 2000);
    };

    return (
        <button
            className={cn(
                "flex items-center justify-center group bg-foreground/10 p-2 transition-all duration-100 hover:scale-105 hover:bg-foreground/20 rounded-md active:scale-95",
                className
            )}
        >
            <span className="sr-only">Copy</span>
            {isCopied ? (
                <Check className="text-neutral-700 group-hover:text-accent" />
            ) : (
                <Comp className="text-neutral-700 group-hover:text-foreground" />
            )}
        </button>
    )
};

export default CopyButton
