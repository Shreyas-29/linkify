import React from 'react';
import { Toaster } from "@/components/ui/sonner";
import { MaxWidthWrapper, Providers } from "@/components";

interface Props {
    children: React.ReactNode
}

const MarketingLayout = ({ children }: Props) => {
    return (
        // <Providers>
        <MaxWidthWrapper>
            <Toaster richColors theme="dark" position="top-right" />
            <main className="mx-auto w-full relative">
                {children}
            </main>
        </MaxWidthWrapper>
        // </Providers>
    );
};

export default MarketingLayout
