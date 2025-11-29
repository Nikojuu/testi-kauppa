import { Organization, WithContext } from "schema-dts";
import { getStoreConfig, getSEOValue, SEO_FALLBACKS } from "@/lib/actions/storeConfigActions";

export default async function OrganizationSchema() {
  try {
    const config = await getStoreConfig();
    const domain = getSEOValue(config.seo.domain, SEO_FALLBACKS.domain);
    const logoUrl = getSEOValue(config.store.logoUrl, SEO_FALLBACKS.logoUrl);
    const description = getSEOValue(config.seo.seoDescription, SEO_FALLBACKS.description);
    const instagramUrl = config.seo.instagramUrl;
    const facebookUrl = config.seo.facebookUrl;

    // Build social media links array
    const sameAs: string[] = [];
    if (instagramUrl) sameAs.push(instagramUrl);
    if (facebookUrl) sameAs.push(facebookUrl);

    const schema: WithContext<Organization> = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: config.store.name,
      url: domain,
      logo: logoUrl.startsWith("http") ? logoUrl : `${domain}${logoUrl}`,
      description,
      address: {
        "@type": "PostalAddress",
        addressCountry: config.store.country,
      },
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        availableLanguage: "Finnish",
      },
      ...(sameAs.length > 0 && { sameAs }),
    };

    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    );
  } catch (error) {
    console.error("Error generating Organization schema:", error);
    return null;
  }
}
