import StorySlides from "@/components/blogs/StorySlides/StorySlides";

export const metadata = {
  title: "The CP Journal  - Content Prompts",
  description:
    "Explore the Content Prompts Journal — real stories of strategy, creativity, and results. Case studies, campaign breakdowns, and insights from the teams behind the work.",
  openGraph: {
    title: "The CP Journal — Content Prompts",
    description:
      "Real stories of strategy, creativity, and results. Case studies and campaign breakdowns from Content Prompts.",
    url: "https://contentprompts.pro/blogs",
  },
  alternates: {
    canonical: "https://contentprompts.pro/blogs",
  },
};

export default function BlogsPage() {
  return (
    <main>
      <StorySlides />
    </main>
  );
}
