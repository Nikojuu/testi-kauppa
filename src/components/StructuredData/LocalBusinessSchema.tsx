import { Store, WithContext } from "schema-dts";
import { getStoreConfig, getSEOValue, SEO_FALLBACKS } from "@/lib/actions/storeConfigActions";

export default async function LocalBusinessSchema() {
  try {
    const config = await getStoreConfig();
    const domain = getSEOValue(config.seo.domain, SEO_FALLBACKS.domain);
    const logoUrl = getSEOValue(config.store.logoUrl, SEO_FALLBACKS.logoUrl);
    const description = getSEOValue(config.seo.seoDescription, SEO_FALLBACKS.description);
    const priceRange = getSEOValue(config.seo.priceRange, SEO_FALLBACKS.priceRange);
    const businessType = getSEOValue(config.seo.businessType, SEO_FALLBACKS.businessType);
    const instagramUrl = config.seo.instagramUrl;
    const facebookUrl = config.seo.facebookUrl;

    // Build social media links array
    const sameAs: string[] = [];
    if (instagramUrl) sameAs.push(instagramUrl);
    if (facebookUrl) sameAs.push(facebookUrl);

    // Format payment methods from config
    const paymentMethods = config.payments.methods
      .map((method) => {
        if (method === "stripe") return "Credit Card, Debit Card";
        if (method === "paytrail") return "Paytrail";
        return method;
      })
      .join(", ");

    const fullLogoUrl = logoUrl.startsWith("http") ? logoUrl : `${domain}${logoUrl}`;

    const schema: WithContext<Store> = {
      "@context": "https://schema.org",
      "@type": "Store",
      "@id": `${domain}/#store`,
      name: config.store.name,
      description,
      url: domain,
      logo: fullLogoUrl,
      image: fullLogoUrl,
      address: {
        "@type": "PostalAddress",
        addressLocality: config.store.city,
        addressCountry: config.store.country,
      },
      priceRange,
      currenciesAccepted: config.store.currency,
      paymentAccepted: paymentMethods,
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "00:00",
        closes: "23:59",
        description: "Verkkokauppa avoinna 24/7",
      },
      ...(sameAs.length > 0 && { sameAs }),
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        email: config.store.email,
        availableLanguage: "Finnish",
      },
    };

    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    );
  } catch (error) {
    console.error("Error generating LocalBusiness schema:", error);
    return null;
  }
}
