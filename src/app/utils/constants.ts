export type PaymentMethod = "stripe" | "paytrail"; // Add more methods as needed

// ============================================
// SEO & BUSINESS CONSTANTS
// TODO: Eventually fetch these from database
// ============================================

// SEO Control - Set to false to disable search engine indexing (for template/development)
export const SEO_ENABLED = false; // Change to true when ready for production

// Store Owner Information
export const STORE_NAME = "Testi Kauppa";
export const STORE_DESCRIPTION = "Testi Kauppa - laadukkaat tuotteet verkossa";
export const STORE_DOMAIN = "https://www.testikauppa.fi"; // Change to your actual domain
export const EMAIL = "info@putiikkipalvelu.fi";

// Branding
export const LOGO_URL = "/logo.svg";
export const OPEN_GRAPH_IMAGE = "/og-image.jpg"; // Default OpenGraph image (1200x630px recommended)
export const TWITTER_IMAGE = "/twitter-image.jpg"; // Default Twitter card image

// Location
export const STORE_CITY = "Helsinki"; // City for local SEO
export const STORE_COUNTRY = "FI"; // ISO country code

// Social Media
export const INSTAGRAM_URL = "https://www.instagram.com/testikauppa"; // Change to your handle

// Google Search Console Verification
export const GOOGLE_VERIFICATION = ""; // Add your verification code from Google Search Console

// Contact
export const CUSTOMER_SERVICE_EMAIL = EMAIL;

// Thease are shown as highlighted 3 categories on the homepage used in CategorySection.tsx
export const SHOWCASE_CATEGORIES = [
  {
    title: "Pyörät",
    description: "tarvitsetko pyörän? täältä löydät kaupunkiin tai maastoon",
    image: "/pyörä1.jpg",
    link: "/products/kaulakorut",
  },
  {
    title: "Kengät",
    description:
      "Kenkävalikoimastani löydät varmasti mieleisesi kengät jokaiseen tilaisuuteen",
    image: "/lenkkarit.jpg",
    link: "/products/korvakorut",
  },
  {
    title: "Hajusteet",
    description:
      "Hajusteet ovat tärkeä osa pukeutumista ja tyyliä täältä löydät omasi",
    image: "/tuoksu.jpg",
    link: "/products/rannekorut",
  },
];

export const PAYMENT_METHODS: PaymentMethod[] = ["stripe"];
