import StorySlides from "@/components/blogs/StorySlides/StorySlides";
import { SEO_BLOGS } from "@/data/seo";

export const metadata = SEO_BLOGS;

export default function BlogsPage() {
  return (
    <main>
      <StorySlides />
    </main>
  );
}
