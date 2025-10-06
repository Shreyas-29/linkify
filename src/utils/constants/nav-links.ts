import { HelpCircleIcon, LineChartIcon, Link2Icon, LockIcon, NewspaperIcon, QrCodeIcon } from "lucide-react";

export const NAV_LINKS = [
    {
        title: "Features",
        href: "/features",
        menu: [
            {
                title: "Link Shortening",
                tagline: "Shorten links and track their performance.",
                href: "/dashboard/links/create",
                icon: Link2Icon,
            },
            {
                title: "Password Protection",
                tagline: "Secure your links with a password.",
                href: "/dashboard/links/create",
                icon: LockIcon,
            },
            {
                title: "Advanced Analytics",
                tagline: "Gain insights into who is clicking your links.",
                href: "/dashboard/links/create",
                icon: LineChartIcon,
            },
            {
                title: "Custom QR Codes",
                tagline: "Use QR codes to reach your audience.",
                href: "/dashboard/links/create",
                icon: QrCodeIcon,
            },
        ],
    },
    {
        title: "Pricing",
        href: "/pricing",
        isModal: true, // Flag để trigger modal thay vì navigate
    },
    {
        title: "Thư ngỏ",
        href: "/#investor",
        openInvestorModal: true,
    },
];
