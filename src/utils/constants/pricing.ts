// export const PLANS = [
//     {
//         name: "Free",
//         info: "For most individuals",
//         price: 0,
//         limits: {
//             links: 25,
//             clicks: 500,
//             tags: 10,
//             users: 1,
//             credits: 10,
//         },
//         btn: {
//             text: "Start for free",
//             href: "/signup",
//             variant: "outlined",
//         },
//         features: [
//             {
//                 text: "Shorten links",
//             },
//             {
//                 text: "Track clicks",
//             },
//             {
//                 text: "Upto 10 tags",
//             },
//             {
//                 text: "Community support",
//             },
//         ],
//     },
//     {
//         name: "Pro",
//         info: "For small businesses",
//         price: 9,
//         limits: {
//             links: 100,
//             clicks: 1000,
//             tags: 50,
//             users: 5,
//             credits: 50,
//         },
//         btn: {
//             text: "Get started",
//             href: "/signup",
//             variant: "contained",
//         },
//         features: [
//             {
//                 text: "Shorten links",
//             },
//             {
//                 text: "Track clicks",
//             },
//             {
//                 text: "Upto 50 tags",
//             },
//             {
//                 text: "Priority support",
//                 tooltip: "Get priority support from our team",
//             },
//             {
//                 text: "AI powered suggestions",
//                 tooltip: "Get upto 50 AI powered suggestions",
//             },
//         ],
//     },
//     {
//         name: "Business",
//         info: "For large businesses",
//         price: 49,
//         limits: {
//             links: 500,
//             clicks: 5000,
//             tags: 100,
//             users: 10,
//             credits: 1000,
//         },
//         btn: {
//             text: "Contact sales",
//             href: "/contact",
//             variant: "outlined",
//         },
//         features: [
//             {
//                 text: "Shorten links",
//             },
//             {
//                 text: "Track clicks",
//             },
//             {
//                 text: "Upto 100 tags",
//             },
//             {
//                 text: "Priority support",
//                 tooltip: "Get priority support from our team",
//             },
//             {
//                 text: "AI powered suggestions",
//                 tooltip: "Get upto 100 AI powered suggestions",
//             },
//         ],
//     },
// ];

export const PLANS = [
    {
        name: "Free",
        info: "For most individuals",
        price: {
            monthly: 0,
            yearly: 0,
        },
        features: [
            { text: "Shorten links" },
            { text: "Up to 100 tags", limit: "100 tags" },
            { text: "Customizable branded links" },
            { text: "Track clicks", tooltip: "1K clicks/month" },
            { text: "Community support", tooltip: "Get answers your questions on discord" },
            { text: "AI powered suggestions", tooltip: "Get up to 100 AI powered suggestions" },
        ],
        btn: {
            text: "Start for free",
            href: "/signup?plan=free",
            variant: "default",
        }
    },
    {
        name: "Pro",
        info: "For small businesses",
        price: {
            monthly: 9,
            yearly: 90,
        },
        features: [
            { text: "Shorten links" },
            { text: "Up to 500 tags", limit: "500 tags" },
            { text: "Customizable branded links" },
            { text: "Track clicks", tooltip: "20K clicks/month" },
            { text: "Export click data", tooltip: "Upto 1K links" },
            { text: "Priority support", tooltip: "Get 24/7 chat support" },
            { text: "AI powered suggestions", tooltip: "Get up to 500 AI powered suggestions" },
        ],
        btn: {
            text: "Get started",
            href: "/signup?plan=pro",
            variant: "purple",
        }
    },
    {
        name: "Business",
        info: "For large organizations",
        price: {
            monthly: 49,
            yearly: 490,
        },
        features: [
            { text: "Shorten links" },
            { text: "Unlimited tags" },
            { text: "Customizable branded links"},
            { text: "Track clicks", tooltip: "Unlimited clicks" },
            { text: "Export click data", tooltip: "Unlimited clicks" },
            { text: "Dedicated manager", tooltip: "Get priority support from our team" },
            { text: "AI powered suggestions", tooltip: "Get unlimited AI powered suggestions" },
        ],
        btn: {
            text: "Contact team",
            href: "/signup?plan=business",
            variant: "default",
        }
    }
];

export const PRICING_FEATURES = [
    {
        text: "Shorten links",
        tooltip: "Create shortened links",
    },
    {
        text: "Track clicks",
        tooltip: "Track clicks on your links",
    },
    {
        text: "See top countries",
        tooltip: "See top countries where your links are clicked",
    },
    {
        text: "Upto 10 tags",
        tooltip: "Add upto 10 tags to your links",
    },
    {
        text: "Community support",
        tooltip: "Community support is available for free users",
    },
    {
        text: "Priority support",
        tooltip: "Get priority support from our team",
    },
    {
        text: "AI powered suggestions",
        tooltip: "Get AI powered suggestions for your links",
    },
];

export const WORKSPACE_LIMIT = 2;