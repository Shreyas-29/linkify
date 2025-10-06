"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from 'next/navigation';
import { getToken } from "@/lib/auth";
import { apiMe } from "@/lib/api";

const AuthCallbackPage = () => {

    const router = useRouter();

    const { data } = useQuery({
        queryKey: ["auth-me"],
        queryFn: async () => {
            const token = getToken();
            if (!token) return { error: true } as any;
            return apiMe(token);
        },
        retry: false,
    });

    if (data?.user) {
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