import React from 'react';
import { Sidebar, DashboardNavbar } from "@/components";

interface Props {
    children: React.ReactNode
}

const MarketingLayout = ({ children }: Props) => {
    return (
        <main className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <Sidebar />
            <div className="flex flex-col h-full w-full">
                <DashboardNavbar />
                <section className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                    {children}
                </section>
            </div>
        </main>
    );
};

export default MarketingLayout
