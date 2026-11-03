import SampleProjectRedirect from "./SampleProjectRedirect";

export const metadata = {
  title: "Blogs  - Content Prompts",
  description:
    "Browse real campaign stories and project breakdowns from Content Prompts — strategy, execution, and results across SEO, social media, and e-commerce.",
  alternates: {
    canonical: "https://contentprompts.pro/sample-project",
  },
};

export default function SampleProjectRoot() {
  return <SampleProjectRedirect />;
}
