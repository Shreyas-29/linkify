"use client";

import { MaxWidthWrapper, PricingCards } from "@/components";
import { Button, buttonVariants } from "@/components/ui/button";
import MagicBadge from "@/components/ui/magic-badge";
import React, { useState } from 'react';
import { cn, COMPANIES, PLANS, PROCESS } from "@/utils";
import { REVIEWS } from "@/utils/constants/misc";
import { currentUser } from "@clerk/nextjs/server";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { FAQ } from "@/utils/constants/faq";

const PricingPage = () => {
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

            <PricingCards />

            <div className="mt-20 w-full">
                <div className="flex flex-col items-center justify-center w-full pt-12">
                    <h2 className="mt-6 text-2xl font-semibold text-center lg:text-3xl xl:text-4xl">
                        Frequently Asked Questions
                    </h2>
                    <p className="max-w-lg mt-6 text-center text-neutral-500">
                        Here are some of the most common questions we get asked. If you have a question that isn&apos;t answered here, feel free to reach out to us.
                    </p>
                </div>
                <div className="max-w-3xl mx-auto w-full mt-20">
                    <Accordion type="single" collapsible>
                        {FAQ.map((faq) => (
                            <AccordionItem key={faq.id} value={faq.id}>
                                <AccordionTrigger>{faq.question}</AccordionTrigger>
                                <AccordionContent>{faq.answer}</AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>

        </MaxWidthWrapper>
    )
};

export default PricingPage
