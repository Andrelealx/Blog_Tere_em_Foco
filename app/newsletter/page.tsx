import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/contact-form";
import { StorySuggestionForm } from "@/components/forms/story-suggestion-form";
import { NewsletterBanner } from "@/components/features/newsletter-banner";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Newsletter e Contato",
  description:
    "Inscreva-se na newsletter e envie mensagens para a equipe do Terê em Foco.",
  path: "/newsletter",
});

export default function NewsletterPage() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-10">
      <NewsletterBanner />
      <div className="grid gap-6 lg:grid-cols-2">
        <ContactForm />
        <StorySuggestionForm />
      </div>
    </div>
  );
}
