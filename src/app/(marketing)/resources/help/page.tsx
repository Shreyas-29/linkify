import { AnimationContainer } from "@/components";
import React from 'react'

const HelpPage = () => {
    return (
        <div className="flex flex-col items-center justify-center py-20">
            <AnimationContainer delay={0.1} className="w-full">
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-semibold font-heading text-center mt-6 !leading-tight">
                    Help
                </h1>
                <p className="text-base md:text-lg mt-6 text-center text-muted-foreground">
                    Need help? We got you.
                </p>
            </AnimationContainer>
        </div>
    )
};

export default HelpPage
