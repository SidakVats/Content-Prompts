import { notFound } from "next/navigation";
import { stories } from "@/components/blogs/StorySlides/stories.js";
import ProjectPageClient from "./ProjectPageClient";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = stories.find((s) => s.slug === slug);

  if (!project) return {};

  return {
    title: project.projectTitle,
    description: project.intro,
    openGraph: {
      title: `${project.projectTitle} — Content Prompts`,
      description: project.intro,
      url: `https://contentprompts.pro/sample-project/${slug}`,
      images: [
        {
          url: project.bannerImg,
          alt: project.projectTitle,
        },
      ],
    },
    alternates: {
      canonical: `https://contentprompts.pro/sample-project/${slug}`,
    },
  };
}

export function generateStaticParams() {
  return stories.map((s) => ({ slug: s.slug }));
}

export default function ProjectPage({ params }) {
  return <ProjectPageClient params={params} />;
}
