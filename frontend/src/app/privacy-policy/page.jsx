export const metadata = {
  title: "Privacy Policy — Content Prompts",
  description:
    "How Content Prompts collects, uses and protects your personal information.",
};

const SECTIONS = [
  {
    id: "1",
    title: "Information We Collect",
    body: (
      <>
        <p><strong>Information you give us:</strong></p>
        <ul>
          <li>Name, email address, phone number and message when you fill in our contact or &ldquo;Free Consultation&rdquo; form, email, call or WhatsApp us;</li>
          <li>Business details, project requirements, content, images and logos you share for a project;</li>
          <li>Billing details such as company name, GST number and address for invoicing;</li>
          <li>Login or account access you provide so we can manage your website, social media or ad accounts.</li>
        </ul>
        <p>
          <strong>Information collected automatically:</strong> When you visit the Website, basic
          technical data may be collected, such as IP address, browser and device type, pages
          visited, time spent and the website that referred you. This is collected through cookies
          and similar tools used by our website platform and analytics services.
        </p>
        <p>
          We do not knowingly collect sensitive data such as passwords for your bank accounts, card
          details, health or biometric information. Please do not send such information to us.
          Online payments, if any, are handled by secure third-party payment providers, and we do
          not store your card details.
        </p>
      </>
    ),
  },
  {
    id: "2",
    title: "How We Use Your Information",
    body: (
      <ul>
        <li>To reply to your enquiries and provide free consultations;</li>
        <li>To prepare proposals, deliver our services and manage your projects;</li>
        <li>To send invoices, project updates and important notices;</li>
        <li>To improve our Website, services and user experience;</li>
        <li>To send you marketing messages or offers, only where you have agreed (you can opt out anytime);</li>
        <li>To meet legal, tax and accounting requirements and to prevent fraud or misuse.</li>
      </ul>
    ),
  },
  {
    id: "3",
    title: "Cookies",
    body: (
      <p>
        Cookies are small files stored on your device that help a website work and understand how
        it is used. Our Website and its service providers may use cookies for basic functions and
        analytics. You can block or delete cookies in your browser settings, but some parts of the
        Website may then not work properly.
      </p>
    ),
  },
  {
    id: "4",
    title: "Sharing of Information",
    body: (
      <>
        <p>We do not sell or rent your personal information. We only share it when needed with:</p>
        <ul>
          <li>Service providers who help us run our business, such as our website host (Hostinger), email, analytics, cloud storage, payment and communication tools;</li>
          <li>Platforms we work on for you, such as Google, Meta (Facebook/Instagram) or YouTube, as required to run your campaigns or pages;</li>
          <li>Government authorities, courts or law enforcement, when required by law; and</li>
          <li>A buyer or successor, if our business is merged or transferred.</li>
        </ul>
        <p>
          These third parties may store data on servers outside India. We take reasonable steps to
          make sure they protect your information.
        </p>
      </>
    ),
  },
  {
    id: "5",
    title: "Data Security",
    body: (
      <p>
        We use reasonable security measures to protect your information from unauthorised access,
        loss or misuse, including secure (HTTPS) connections and limited access to client data.
        Client login details are used only for the agreed work. However, no internet transmission
        or storage is 100% secure, and we cannot guarantee absolute security.
      </p>
    ),
  },
  {
    id: "6",
    title: "How Long We Keep Your Data",
    body: (
      <p>
        We keep your personal information only as long as needed for the purposes in this policy,
        for example, while we are working with you and afterwards as required for legal, tax or
        accounting reasons. Enquiries that do not lead to a project are usually deleted within 12
        months. When no longer needed, data is deleted or anonymised.
      </p>
    ),
  },
  {
    id: "7",
    title: "Your Rights",
    body: (
      <>
        <p>Subject to applicable law, you have the right to:</p>
        <ul>
          <li>ask what personal information we hold about you and get a summary of it;</li>
          <li>ask us to correct, update or complete your information;</li>
          <li>ask us to delete your information, unless we must keep it by law;</li>
          <li>withdraw your consent to marketing messages at any time;</li>
          <li>nominate another person to exercise your rights in case of death or incapacity; and</li>
          <li>raise a complaint with us, and if not resolved, with the Data Protection Board of India.</li>
        </ul>
        <p>
          To use any of these rights, email us at{" "}
          <a href="mailto:Contentprompts@gmail.com" className="underline underline-offset-2 hover:opacity-70 transition-opacity">
            Contentprompts@gmail.com
          </a>
          . We will respond within a reasonable time, normally within 30 days.
        </p>
      </>
    ),
  },
  {
    id: "8",
    title: "Children's Privacy",
    body: (
      <p>
        Our Website and services are meant for businesses and adults. We do not knowingly collect
        personal information from anyone under 18 years of age. If you believe a child has shared
        information with us, please contact us and we will delete it.
      </p>
    ),
  },
  {
    id: "9",
    title: "Third-Party Links",
    body: (
      <p>
        Our Website contains links to other websites and social media pages (such as Facebook,
        Instagram and YouTube). We are not responsible for their privacy practices. Please read
        their privacy policies separately.
      </p>
    ),
  },
  {
    id: "10",
    title: "Changes to This Policy",
    body: (
      <p>
        We may update this Privacy Policy from time to time. The latest version will always be
        available on this page with the updated date.
      </p>
    ),
  },
  {
    id: "11",
    title: "Grievance Officer and Contact",
    body: (
      <>
        <p>If you have any questions, concerns or complaints about this Privacy Policy or your data, please contact our Grievance Officer:</p>
        <ul>
          <li><strong>Name:</strong> Neha Mann</li>
          <li><strong>Business:</strong> Content Prompts</li>
          <li><strong>Website:</strong> <a href="https://contentprompts.pro" className="underline underline-offset-2 hover:opacity-70 transition-opacity">https://contentprompts.pro</a></li>
          <li><strong>Email:</strong> <a href="mailto:Contentprompts@gmail.com" className="underline underline-offset-2 hover:opacity-70 transition-opacity">Contentprompts@gmail.com</a></li>
          <li><strong>Phone / WhatsApp:</strong> <a href="tel:+919910449552" className="underline underline-offset-2 hover:opacity-70 transition-opacity">+91 9910449552</a></li>
          <li><strong>Address:</strong> A1-42 First floor, Paschim Vihar, Delhi 110063</li>
        </ul>
        <p>We aim to acknowledge complaints within 24 hours and resolve them within 15 days.</p>
      </>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#edeee8] min-h-screen">

      <section className="w-full pt-36 pb-12 px-5 md:px-10 lg:px-16 border-b border-[#0f0f0f]/10">
        <p className="font2 uppercase tracking-[0.25em] text-xs text-[#353333] mb-4">Legal</p>
        <h1
          className="font-medium uppercase leading-[0.85] tracking-tight text-[#0f0f0f]"
          style={{ fontSize: "clamp(2.8rem, 8vw, 7rem)", letterSpacing: "-0.03em" }}
        >
          Privacy<br />Policy
        </h1>
        <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-8 text-sm text-[#353333]/60 font2">
          <span className="tracking-wide">
            How{" "}
            <a href="https://contentprompts.pro" className="text-[#331C4F] hover:opacity-70 transition-opacity">
              Content Prompts
            </a>{" "}
            collects, uses and protects your information
          </span>
          <span className="hidden sm:block w-px h-4 bg-[#0f0f0f]/20" />
          <span className="tracking-wide">Last updated: 26 October 2026</span>
        </div>
      </section>

      <section className="w-full px-5 md:px-10 lg:px-16 py-10 border-b border-[#0f0f0f]/10">
        <p className="text-[#0f0f0f]/70 leading-relaxed text-base md:text-lg">
          Content Prompts (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) respects your
          privacy. This Privacy Policy explains what personal information we collect through{" "}
          <a href="https://contentprompts.pro" className="text-[#331C4F] hover:opacity-70 transition-opacity">
            https://contentprompts.pro
          </a>{" "}
          and our services, how we use it, and the choices you have. This policy is prepared in
          line with India&rsquo;s Information Technology Act, 2000, its rules, and the Digital
          Personal Data Protection Act, 2023. By using the Website or sharing your information with
          us, you agree to this policy.
        </p>
      </section>

      <section className="w-full px-5 md:px-10 lg:px-16 py-10 pb-24">
        <div className="flex flex-col divide-y divide-[#0f0f0f]/8">
          {SECTIONS.map(({ id, title, body }) => (
            <div key={id} className="py-8 md:py-10 flex flex-col md:flex-row gap-4 md:gap-16">
              <div className="md:w-64 shrink-0">
                <span className="font2 text-[0.65rem] tracking-[0.2em] uppercase text-[#353333]/40">
                  {id.padStart(2, "0")}
                </span>
                <h2
                  className="font2 uppercase text-[#0f0f0f] leading-tight mt-1"
                  style={{ fontSize: "clamp(0.85rem, 1.2vw, 1rem)", letterSpacing: "0.05em" }}
                >
                  {title}
                </h2>
              </div>
              <div className="flex-1 text-[#0f0f0f]/70 leading-relaxed text-sm md:text-base
                              [&_p]:mb-4 [&_p:last-child]:mb-0
                              [&_ul]:space-y-2 [&_ul]:list-none [&_ul]:pl-0
                              [&_li]:pl-4 [&_li]:relative
                              [&_li]:before:content-['—'] [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:text-[#331C4F]/50
                              [&_strong]:text-[#0f0f0f] [&_strong]:font-medium
                              [&_a]:text-[#331C4F]">
                {body}
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
