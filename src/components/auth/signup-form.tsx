"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// removed Clerk; using backend API
import { Eye, EyeOff, LoaderIcon } from "lucide-react";
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from "sonner";
import { Label } from "../ui/label";
import { useMutation } from "@tanstack/react-query";
import { apiRegister } from "@/lib/api";
import { setToken } from "@/lib/auth";

const SignUpForm = () => {

    const router = useRouter();

    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [emailError, setEmailError] = useState<string>("");

    const mutation = useMutation({
        mutationFn: (payload: { name?: string; email: string; password: string }) => apiRegister(payload),
        onSuccess: (data) => {
            setEmailError("");
            setToken(data.token);
            toast.success("Đăng ký thành công");
            router.push("/dashboard");
        },
        onError: (error: any) => {
            toast.error(error?.message || "Đăng ký thất bại");
            if (typeof error?.message === "string") {
                setEmailError(error.message);
            }
        }
    });

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !email || !password) {
            toast.error("Name, email and password are required!");
            return;
        }

        setIsUpdating(true);

        try {
            await mutation.mutateAsync({ name, email, password });
        } finally {
            setIsUpdating(false);
        }
    };
    return (
        <div className="flex flex-col items-start gap-y-6 py-8 w-full px-0.5">
            <h2 className="text-2xl font-semibold">
                Create an account
            </h2>

            <form onSubmit={handleSignUp} className="w-full">
                <div className="space-y-2 w-full">
                    <Label htmlFor="name">
                        Name
                    </Label>
                    <Input
                        id="name"
                        type="name"
                        value={name}
                        disabled={isUpdating}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        className="w-full focus-visible:border-foreground"
                    />
                </div>
                <div className="mt-4 space-y-2 w-full">
                    <Label htmlFor="email">
                        Email
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        value={email}
                        disabled={isUpdating}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full focus-visible:border-foreground"
                    />
                    {emailError && (
                        <p className="text-sm text-red-500 mt-1">{emailError}</p>
                    )}
                </div>
                <div className="mt-4 space-y-2">
                    <Label htmlFor="password">
                        Password
                    </Label>
                    <div className="relative w-full">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            disabled={isUpdating}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="w-full focus-visible:border-foreground"
                        />
                        <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="absolute top-1 right-1"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ?
                                <EyeOff className="w-4 h-4" /> :
                                <Eye className="w-4 h-4" />
                            }
                        </Button>
                    </div>
                </div>
                <div className="mt-4 w-full">
                    <Button
                        type="submit"
                        disabled={isUpdating}
                        className="w-full"
                    >
                        {isUpdating ? (
                            <LoaderIcon className="w-5 h-5 animate-spin" />
                        ) : "Continue"}
                    </Button>
                </div>
            </form>
        </div>
    )
};

export default SignUpForm
