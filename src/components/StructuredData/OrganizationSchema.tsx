import { Organization, WithContext } from "schema-dts";
import {
  STORE_NAME,
  STORE_DOMAIN,
  LOGO_URL,
  STORE_DESCRIPTION,
  STORE_COUNTRY,
  INSTAGRAM_URL,
} from "@/app/utils/constants";

export default function OrganizationSchema() {
  const schema: WithContext<Organization> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: STORE_NAME,
    url: STORE_DOMAIN,
    logo: `${STORE_DOMAIN}${LOGO_URL}`,
    description: STORE_DESCRIPTION,
    address: {
      "@type": "PostalAddress",
      addressCountry: STORE_COUNTRY,
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: "Finnish",
    },
    sameAs: [INSTAGRAM_URL],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
