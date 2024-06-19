"use client";

import { MaxWidthWrapper } from "@/components";
import { Button, buttonVariants } from "@/components/ui/button";
import MagicBadge from "@/components/ui/magic-badge";
import React, { useState } from 'react';
import { cn, COMPANIES, PLANS, PROCESS } from "@/utils";
import { REVIEWS } from "@/utils/constants/misc";
import { currentUser } from "@clerk/nextjs/server";
import { ArrowRightIcon, ArrowUpCircle, CheckCircleIcon, CreditCardIcon, HeadphonesIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

type Tab = "monthly" | "yearly";

const PricingPage = () => {

    const MotionTabTrigger = motion(TabsTrigger);

    const [activeTab, setActiveTab] = useState<Tab>("monthly");

    return (
        <MaxWidthWrapper className="mb-40">
            <div className="flex flex-col items-center justify-center py-10 max-w-lg mx-auto">
                <MagicBadge title="Pricing" />
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-semibold font-heading text-center mt-6 !leading-tight">
                    Simple and transparent pricing
                </h1>
                <p className="text-base md:text-lg mt-6 text-center text-muted-foreground">
                    Choose a plan that works for you. No hidden fees. No surprises.
                </p>
            </div>
            {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 w-full md:gap-8 py-10 flex-wrap max-w-5xl mx-auto">
                {PLANS.map((plan, index) => (
                    <Card
                        key={index}
                        className={cn(
                            "flex flex-col w-full border-border rounded-xl",
                            plan.name === "Pro" && "border-2 border-purple-500"
                        )}
                    >
                        <CardHeader className={cn(
                            "border-b border-border",
                            plan.name === "Pro" ? "bg-purple-500/[0.07]" : "bg-foreground/[0.03]"
                        )}>
                            <CardTitle className={cn(plan.name !== "Pro" && "text-muted-foreground", "text-lg font-medium")}>
                                {plan.name}
                            </CardTitle>
                            <CardDescription>
                                {plan.info}
                            </CardDescription>
                            <h5 className="text-3xl font-semibold">
                                ${plan.price}
                                <span className="text-base text-muted-foreground font-normal">
                                    /month
                                </span>
                            </h5>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            {plan.features.map((feature, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <CheckCircleIcon className="text-purple-500 w-4 h-4" />
                                    <TooltipProvider>
                                        <Tooltip delayDuration={0}>
                                            <TooltipTrigger asChild>
                                                <p className={cn(feature.tooltip && "border-b !border-dashed border-border cursor-pointer")}>
                                                    {feature.text} {feature.limit && <span className="text-xs text-gray-500">({feature.limit})</span>}
                                                </p>
                                            </TooltipTrigger>
                                            {feature.tooltip && (
                                                <TooltipContent>
                                                    <p>{feature.tooltip}</p>
                                                </TooltipContent>
                                            )}
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            ))}
                        </CardContent>
                        <CardFooter className="w-full pt- mt-auto">
                            <Link
                                href={plan.btn.href}
                                style={{ width: "100%" }}
                                className={buttonVariants({ className: plan.name === "Pro" && "bg-purple-500 hover:bg-purple-500/80 text-white" })}
                            >
                                {plan.btn.text}
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
            </div> */}
            <Tabs defaultValue="monthly" className="w-full flex flex-col items-center justify-center">
                <TabsList>
                    <MotionTabTrigger
                        value="monthly"
                        onClick={() => setActiveTab("monthly")}
                        className="relative"
                    >
                        {activeTab === "monthly" && (
                            <motion.div
                                layoutId="active-tab-indicator"
                                transition={{
                                    type: "spring",
                                    bounce: 0.5,
                                }}
                                className="absolute top-0 left-0 w-full h-full bg-background shadow-sm rounded-md z-10"
                            />
                        )}
                        <span className="z-20">
                            monthly
                        </span>
                    </MotionTabTrigger>
                    <MotionTabTrigger
                        value="yearly"
                        onClick={() => setActiveTab("yearly")}
                        className="relative"
                    >
                        {activeTab === "yearly" && (
                            <motion.div
                                layoutId="active-tab-indicator"
                                transition={{
                                    type: "spring",
                                    bounce: 0.5,
                                }}
                                className="absolute top-0 left-0 w-full h-full bg-background shadow-sm rounded-md z-10"
                            />
                        )}
                        <span className="z-20">
                            yearly
                        </span>
                    </MotionTabTrigger>
                </TabsList>

                <TabsContent value="monthly" className="grid grid-cols-1 lg:grid-cols-3 gap-5 w-full md:gap-8 flex-wrap max-w-5xl mx-auto pt-6">
                    {PLANS.map((plan) => (
                        <Card
                            key={plan.name}
                            className={cn(
                                "flex flex-col w-full border-border rounded-xl",
                                plan.name === "Pro" && "border-2 border-purple-500"
                            )}
                        >
                            <CardHeader className={cn(
                                "border-b border-border",
                                plan.name === "Pro" ? "bg-purple-500/[0.07]" : "bg-foreground/[0.03]"
                            )}>
                                <CardTitle className={cn(plan.name !== "Pro" && "text-muted-foreground", "text-lg font-medium")}>
                                    {plan.name}
                                </CardTitle>
                                <CardDescription>
                                    {plan.info}
                                </CardDescription>
                                <h5 className="text-3xl font-semibold">
                                    ${plan.price.monthly}
                                    <span className="text-base text-muted-foreground font-normal">
                                        {plan.name !== "Free" ? "/month" : ""}
                                    </span>
                                </h5>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                {plan.features.map((feature, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <CheckCircleIcon className="text-purple-500 w-4 h-4" />
                                        <TooltipProvider>
                                            <Tooltip delayDuration={0}>
                                                <TooltipTrigger asChild>
                                                    <p className={cn(feature.tooltip && "border-b !border-dashed border-border cursor-pointer")}>
                                                        {feature.text}
                                                    </p>
                                                </TooltipTrigger>
                                                {feature.tooltip && (
                                                    <TooltipContent>
                                                        <p>{feature.tooltip}</p>
                                                    </TooltipContent>
                                                )}
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                ))}
                            </CardContent>
                            <CardFooter className="w-full pt- mt-auto">
                                <Link
                                    href={plan.btn.href}
                                    style={{ width: "100%" }}
                                    className={buttonVariants({ className: plan.name === "Pro" && "bg-purple-500 hover:bg-purple-500/80 text-white" })}
                                >
                                    {plan.btn.text}
                                </Link>
                            </CardFooter>
                        </Card>
                    ))}
                </TabsContent>
                <TabsContent value="yearly" className="grid grid-cols-1 lg:grid-cols-3 gap-5 w-full md:gap-8 flex-wrap max-w-5xl mx-auto pt-6">
                    {PLANS.map((plan) => (
                        <Card
                            key={plan.name}
                            className={cn(
                                "flex flex-col w-full border-border rounded-xl",
                                plan.name === "Pro" && "border-2 border-purple-500"
                            )}
                        >
                            <CardHeader className={cn(
                                "border-b border-border",
                                plan.name === "Pro" ? "bg-purple-500/[0.07]" : "bg-foreground/[0.03]"
                            )}>
                                <CardTitle className={cn(plan.name !== "Pro" && "text-muted-foreground", "text-lg font-medium")}>
                                    {plan.name}
                                </CardTitle>
                                <CardDescription>
                                    {plan.info}
                                </CardDescription>
                                <h5 className="text-3xl font-semibold">
                                    ${plan.price.yearly}
                                    <span className="text-base text-muted-foreground font-normal">
                                        {plan.name !== "Free" ? "/year" : ""}
                                    </span>
                                </h5>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                {plan.features.map((feature, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <CheckCircleIcon className="text-purple-500 w-4 h-4" />
                                        <TooltipProvider>
                                            <Tooltip delayDuration={0}>
                                                <TooltipTrigger asChild>
                                                    <p className={cn(feature.tooltip && "border-b !border-dashed border-border cursor-pointer")}>
                                                        {feature.text}
                                                    </p>
                                                </TooltipTrigger>
                                                {feature.tooltip && (
                                                    <TooltipContent>
                                                        <p>{feature.tooltip}</p>
                                                    </TooltipContent>
                                                )}
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                ))}
                            </CardContent>
                            <CardFooter className="w-full pt- mt-auto">
                                <Link
                                    href={plan.btn.href}
                                    style={{ width: "100%" }}
                                    className={buttonVariants({ className: plan.name === "Pro" && "bg-purple-500 hover:bg-purple-500/80 text-white" })}
                                >
                                    {plan.btn.text}
                                </Link>
                            </CardFooter>
                        </Card>
                    ))}
                </TabsContent>
            </Tabs>
        </MaxWidthWrapper>
    )
};

export default PricingPage
