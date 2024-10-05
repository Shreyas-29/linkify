import { Footer, Navbar } from '@/components';
import { Button } from "@/components/ui/button";
import Link from 'next/link';

const NotFound = () => {
    return (
        <main className="relative flex flex-col items-center justify-center px-4">

            <Navbar />

            <div className="flex flex-col items-center justify-center mx-auto h-screen">

                <div className="flex items-center justify-center h-full flex-col">
                    <span className="text-sm font-medium px-3.5 py-1 rounded-md bg-gradient-to-br from-violet-400 to-purple-600 text-neutral-50 not-found">
                        404
                    </span>
                    <h1 className="text-3xl md:text-5xl font-bold text-neutral-50 mt-5">
                        Not Found
                    </h1>
                    <p className="text-base text-neutral-400 font-medium mt-5 text-center mx-auto max-w-xl">
                        The page you are looking for does not exist. <br /> But don&apos;t worry, we&apos;ve got you covered. You can{" "}
                        <Link href="/resources/help" className="text-foreground">
                            contact us
                        </Link>
                        .
                    </p>
                    <Link href="/">
                        <Button className="mt-8">
                            Back to homepage
                        </Button>
                    </Link>
                </div>

            </div>

            <Footer />

        </main>
    )
}

export default NotFound