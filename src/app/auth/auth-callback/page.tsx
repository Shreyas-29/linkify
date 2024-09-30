"use client";

import { getAuthStatus } from "@/actions";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from 'next/navigation';

const AuthCallbackPage = () => {

    const router = useRouter();

    const { data } = useQuery({
        queryKey: ["auth-status"],
        queryFn: async () => await getAuthStatus(),
        retry: true,
        retryDelay: 500,
    });

    if (data?.success) {
        router.push("/dashboard");
    }

    return (
        <div className="flex items-center justify-center flex-col h-screen relative">
            <div className="border-[3px] border-neutral-800 rounded-full border-b-neutral-200 animate-loading w-8 h-8"></div>
            <p className="text-lg font-medium text-center mt-3">
                Verifying your account...
            </p>
        </div>
    )
};

export default AuthCallbackPage;