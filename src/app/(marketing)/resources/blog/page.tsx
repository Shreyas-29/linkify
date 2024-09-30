import React from 'react'

const BlogPage = () => {
    return (
        <div className="flex flex-col items-center justify-center py-20">
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-semibold font-heading text-center mt-6 !leading-tight">
                Blog
            </h1>
            <p className="text-base md:text-lg mt-6 text-center text-muted-foreground">
                Explore our latest blog posts.
            </p>
        </div>
    )
};

export default BlogPage
