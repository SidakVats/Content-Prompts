import React from 'react'
import ContactHeader from '@/components/contact/ContactHeader/ContactHeader'

export const metadata = {
  title: "Contact Us - Content Prompts",
  description:
    "Got a bold idea or need content that converts? Reach out to the Content Prompts team — we're all ears. Drop us a line and let's start building something great together.",
  openGraph: {
    title: "Slide In — Contact Content Prompts",
    description:
      "Got a bold idea? Need content that actually converts? Content Prompts is listening. Reach out today.",
    url: "https://contentprompts.pro/contact",
  },
  alternates: {
    canonical: "https://contentprompts.pro/contact",
  },
};

const page = () => {
  return <ContactHeader />
}

export default page
