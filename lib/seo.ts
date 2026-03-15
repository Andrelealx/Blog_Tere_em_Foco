import type { Metadata } from "next";

interface SeoInput {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
}

export const siteConfig = {
  name: "Terê em Foco",
  description:
    "Blog informativo e turístico sobre Teresópolis com roteiros, notícias e experiências locais.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://tereemfoco.com.br",
  locale: "pt_BR",
};

export function buildMetadata({
  title,
  description,
  path = "",
  image = "/images/hero-serra.jpg",
  type = "website",
}: SeoInput = {}): Metadata {
  const pageTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;
  const pageDescription = description ?? siteConfig.description;
  const url = `${siteConfig.url}${path}`;
  const fullImage = image.startsWith("http") ? image : `${siteConfig.url}${image}`;

  return {
    metadataBase: new URL(siteConfig.url),
    title: pageTitle,
    description: pageDescription,
    alternates: { canonical: url },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type,
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: pageTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: [fullImage],
    },
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.path}`,
    })),
  };
}
