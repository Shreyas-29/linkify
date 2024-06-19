import React from 'react';

interface Props {
    children: React.ReactNode
}

const MarketingLayout = ({ children }: Props) => {
    return (
        <>
            {/* <Providers> */}
            {children}
            {/* </Providers> */}
        </>
    );
};

export default MarketingLayout
