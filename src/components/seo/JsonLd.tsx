import { brand, siteUrl } from "@/data/brand";
import { faq } from "@/data/faq";

/**
 * Structured data without invented facts: no fake address, phone or
 * ratings. A WebSite node, the service list and the FAQ text.
 */
export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: brand.name,
        description: "Мойка окон в Москве и Московской области: квартиры, панорамное остекление, балконы, витрины, офисы, окна после ремонта.",
        inLanguage: "ru-RU",
      },
      {
        "@type": "Service",
        name: "Мойка окон в Москве",
        serviceType: "Мойка окон",
        areaServed: [{ "@type": "City", name: "Москва" }, { "@type": "AdministrativeArea", name: "Московская область" }],
        provider: { "@type": "Organization", name: brand.name, url: siteUrl },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Услуги",
          itemListElement: [
            "Мойка окон в квартирах",
            "Мойка панорамных окон",
            "Мойка балконов и лоджий",
            "Мойка витрин",
            "Мойка офисных окон",
            "Мойка окон после ремонта",
            "Мойка труднодоступных окон",
            "Мойка москитных сеток",
          ].map((name) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name } })),
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
