import { BarChart3Icon, FolderOpenIcon, WandSparklesIcon } from "lucide-react";

export const DEFAULT_AVATAR_URL = "https://api.dicebear.com/8.x/initials/svg?backgroundType=gradientLinear&backgroundRotation=0,360&seed=";

export const PAGINATION_LIMIT = 10;

export const COMPANIES = [
    {
        name: "Asana",
        logo: "/assets/company-01.svg",
    },
    {
        name: "Tidal",
        logo: "/assets/company-02.svg",
    },
    {
        name: "Innovaccer",
        logo: "/assets/company-03.svg",
    },
    {
        name: "Linear",
        logo: "/assets/company-04.svg",
    },
    {
        name: "Raycast",
        logo: "/assets/company-05.svg",
    },
    {
        name: "Labelbox",
        logo: "/assets/company-06.svg",
    }
] as const;

export const PROCESS = [
    {
        title: "Organize Your Links",
        description: "Efficiently categorize and tag your links for quick access and easy management.",
        icon: FolderOpenIcon,
    },
    {
        title: "Shorten and Customize",
        description: "Create concise, branded links that are easy to share and track.",
        icon: WandSparklesIcon,
    },
    {
        title: "Analyze and Optimize",
        description: "Gain insights into link performance and optimize for better engagement.",
        icon: BarChart3Icon,
    },
] as const;

export const FEATURES = [
    {
        title: "Link shortening",
        description: "Create short links that are easy to remember and share.",
    },
    {
        title: "Advanced analytics",
        description: "Track and measure the performance of your links.",
    },
    {
        title: "Password protection",
        description: "Secure your links with a password.",
    },
    {
        title: "Custom QR codes",
        description: "Generate custom QR codes for your links.",
    },
    {
        title: "Link expiration",
        description: "Set an expiration date for your links.",
    },
    {
        title: "Team collaboration",
        description: "Share links with your team and collaborate in real-time.",
    },
] as const;

export const REVIEWS = [
    {
        name: "Michael Smith",
        username: "@michaelsmith",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
        rating: 5,
        review: "Công cụ này đúng là cứu cánh! Quản lý và theo dõi liên kết chưa bao giờ dễ đến thế. Bắt buộc phải có nếu bạn xử lý nhiều liên kết."
    },
    {
        name: "Emily Johnson",
        username: "@emilyjohnson",
        avatar: "https://randomuser.me/api/portraits/women/1.jpg",
        rating: 4,
        review: "Ứng dụng rất hữu ích! Luồng công việc của tôi gọn gàng hơn hẳn. Vẫn còn vài lỗi nhỏ, nhưng tổng thể trải nghiệm rất tốt."
    },
    {
        name: "Daniel Williams",
        username: "@danielwilliams",
        avatar: "https://randomuser.me/api/portraits/men/2.jpg",
        rating: 5,
        review: "Tôi dùng ứng dụng mỗi ngày suốt nhiều tháng. Insight và báo cáo phân tích mang lại giá trị lớn. Rất đáng dùng!"
    },
    {
        name: "Sophia Brown",
        username: "@sophiabrown",
        avatar: "https://randomuser.me/api/portraits/women/2.jpg",
        rating: 4,
        review: "Ứng dụng tuyệt vời! Cung cấp đủ mọi thứ tôi cần để quản lý liên kết hiệu quả."
    },
    {
        name: "James Taylor",
        username: "@jamestaylor",
        avatar: "https://randomuser.me/api/portraits/men/3.jpg",
        rating: 5,
        review: "Rất thích ứng dụng này! Trực quan và nhiều tính năng. Giúp tôi cải thiện đáng kể việc quản lý và theo dõi liên kết."
    },
    {
        name: "Olivia Martinez",
        username: "@oliviamartinez",
        avatar: "https://randomuser.me/api/portraits/women/3.jpg",
        rating: 4,
        review: "Ứng dụng rất tiềm năng. Đã giúp tôi tiết kiệm nhiều thời gian. Rất mong các cập nhật và cải tiến tiếp theo."
    },
    {
        name: "William Garcia",
        username: "@williamgarcia",
        avatar: "https://randomuser.me/api/portraits/men/4.jpg",
        rating: 5,
        review: "Ứng dụng thay đổi cuộc chơi trong quản lý liên kết. Dễ dùng, cực kỳ mạnh mẽ và rất đáng khuyến nghị!"
    },
    {
        name: "Mia Rodriguez",
        username: "@miarodriguez",
        avatar: "https://randomuser.me/api/portraits/women/4.jpg",
        rating: 4,
        review: "Tôi đã thử nhiều công cụ quản lý liên kết, và ứng dụng này nổi bật. Đơn giản, hiệu quả."
    },
    {
        name: "Henry Lee",
        username: "@henrylee",
        avatar: "https://randomuser.me/api/portraits/men/5.jpg",
        rating: 5,
        review: "Ứng dụng đã thay đổi cách tôi làm việc. Quản lý và phân tích liên kết giờ đây quá dễ. Khó mà làm việc thiếu nó."
    },
] as const;
