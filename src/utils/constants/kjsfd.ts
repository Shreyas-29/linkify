export const PLANS = [
    {
        name: "Free",
        info: "For most individuals",
        price: 0,
        limits: {
            links: 25,
            clicks: 500,
            tags: 10,
            users: 1,
            credits: 10,
        },
        btn: {
            text: "Start for free",
            href: "/signup",
            variant: "outlined",
        },
        features: [
            {
                text: "Shorten links",
            },
            {
                text: "Track clicks",
            },
            {
                text: "Upto 10 tags",
            },
            {
                text: "Community support",
            },
        ],
    },
    {
        name: "Pro",
        info: "For small businesses",
        price: 9,
        limits: {
            links: 100,
            clicks: 1000,
            tags: 50,
            users: 5,
            credits: 50,
        },
        btn: {
            text: "Get started",
            href: "/signup",
            variant: "contained",
        },
        features: [
            {
                text: "Shorten links",
            },
            {
                text: "Track clicks",
            },
            {
                text: "Upto 50 tags",
            },
            {
                text: "Priority support",
                tooltip: "Get priority support from our team",
            },
            {
                text: "AI powered suggestions",
                tooltip: "Get upto 50 AI powered suggestions",
            },
        ],
    },
    {
        name: "Business",
        info: "For large businesses",
        price: 49,
        limits: {
            links: 500,
            clicks: 5000,
            tags: 100,
            users: 10,
            credits: 1000,
        },
        btn: {
            text: "Contact sales",
            href: "/contact",
            variant: "outlined",
        },
        features: [
            {
                text: "Shorten links",
            },
            {
                text: "Track clicks",
            },
            {
                text: "Upto 100 tags",
            },
            {
                text: "Priority support",
                tooltip: "Get priority support from our team",
            },
            {
                text: "AI powered suggestions",
                tooltip: "Get upto 100 AI powered suggestions",
            },
        ],
    },
];