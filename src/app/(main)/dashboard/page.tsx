"use client"

import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import React from 'react'

const DashboardPage = () => {

    const { isLoaded, isSignedIn, signOut } = useAuth();

    return (
        <div>
            Page
            <Button onClick={() => signOut()}>
                Sign Out
            </Button>
        </div>
    )
};

export default DashboardPage
