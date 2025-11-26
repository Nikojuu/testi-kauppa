import { Store, WithContext } from "schema-dts";
import {
  STORE_NAME,
  STORE_DOMAIN,
  LOGO_URL,
  STORE_DESCRIPTION,
  STORE_CITY,
  STORE_COUNTRY,
  INSTAGRAM_URL,
  CUSTOMER_SERVICE_EMAIL,
} from "@/app/utils/constants";

export default function LocalBusinessSchema() {
  const schema: WithContext<Store> = {
    "@context": "https://schema.org",
    "@type": "Store",
    "@id": `${STORE_DOMAIN}/#store`,
    name: STORE_NAME,
    description: STORE_DESCRIPTION,
    url: STORE_DOMAIN,
    logo: `${STORE_DOMAIN}${LOGO_URL}`,
    image: `${STORE_DOMAIN}${LOGO_URL}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: STORE_CITY,
      addressCountry: STORE_COUNTRY,
    },
    priceRange: "€€",
    currenciesAccepted: "EUR",
    paymentAccepted: "Credit Card, Debit Card, Paytrail, Stripe",
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
    sameAs: [INSTAGRAM_URL],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: CUSTOMER_SERVICE_EMAIL,
      availableLanguage: "Finnish",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
