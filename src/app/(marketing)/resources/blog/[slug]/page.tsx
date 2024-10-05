import React from 'react'
import blogs from "@/utils/constants/blogs.json";
interface Props {
    params: {
        slug: string
    }
}

const BlogPage = ({ params }: Props) => {

    const blog = blogs.find((blog) => blog.slug === params.slug);
    return (
        <div className="flex flex-col items-center justify-center max-w-6xl mx-auto px-4 md:px-0 pb-80">
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-semibold font-heading text-center mt-6 !leading-tight">
                    {blog?.title}
                </h1>
                <p className="text-base md:text-lg mt-6 text-center text-muted-foreground">
                    {blog?.description}
                </p>
            </div>
        </div>
    )
};

export default BlogPage
