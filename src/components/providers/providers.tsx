"use client";

import React from 'react'
import { ClerkProvider } from '@clerk/nextjs'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface Props {
    children: React.ReactNode;
}

const Providers = ({ children }: Props) => {

    const client = new QueryClient();

    return (
        <QueryClientProvider client={client}>
            <ClerkProvider>
                {children}
            </ClerkProvider>
        </QueryClientProvider>
    )
};

export default Providers
