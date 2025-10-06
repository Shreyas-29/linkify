import React from 'react';
import { Navbar, Footer } from "@/components";

interface Props {
    children: React.ReactNode
}

const DashboardLayout = ({ children }: Props) => {
    return (
        <>
            <Navbar />
            <main className="mt-20 mx-auto w-full z-0 relative">
                {children}
            </main>
            <Footer />
        </>
    );
};

export default DashboardLayout

