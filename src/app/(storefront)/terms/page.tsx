import { Metadata } from "next";
import { getStoreConfig } from "@/lib/actions/storeConfigActions";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const config = await getStoreConfig();

    return {
      title: `${config.store.name} | Maksu- ja toimitusehdot`,
      description: "Tietoa palautuskäytännöistä, toimituksesta ja maksutavoista.",
      robots: {
        index: false,
        follow: false,
      },
      openGraph: {
        title: `${config.store.name} | Maksu- ja toimitusehdot`,
        type: "website",
      },
    };
  } catch (error) {
    console.error("Error generating terms page metadata:", error);

    return {
      title: "Maksu- ja toimitusehdot",
      description: "Tietoa palautuskäytännöistä, toimituksesta ja maksutavoista.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }
}

export default async function TermsPage() {
  return (
    <div className="mx-auto max-w-screen-2xl py-8 px-4 mt-24 md:mt-48">
      <h1 className="text-3xl font-secondary font-bold mb-6">
        Maksu- ja toimitusehdot
      </h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Palautuskäytännöt</h2>
        <h3 className="text-xl font-medium mb-2">
          14 päivän peruuttamisoikeus
        </h3>
        <p className="mb-4">
          Asiakkaalla on oikeus peruuttaa tilaus 14 päivän kuluessa tuotteen
          vastaanottamisesta ilman erityistä syytä.
        </p>
        <h3 className="text-xl font-medium mb-2">Miten peruutus tehdään</h3>
        <p className="mb-4">
          Peruuttamisoikeuden käyttämiseksi asiakkaan on ilmoitettava
          päätöksestä peruuttaa tilaus yksiselitteisellä tavalla (esim.
          kirjeellä tai sähköpostilla). Sähköpostiosoite on{" "}
          {/* <a href={`mailto:${email}`} className="text-blue-600">
            {email}
          </a> */}
          .
        </p>
        <h3 className="text-xl font-medium mb-2">Palautuskulut</h3>
        <p className="mb-4">
          Asiakas vastaa palautuksesta aiheutuvista kuluista, ellei tuote ole
          virheellinen tai vaurioitunut.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Toimituskäytännöt</h2>
        <h3 className="text-xl font-medium mb-2">Toimitusaika</h3>
        <p className="mb-4">
          Toimitamme tuotteet yleensä 3-5 arkipäivän kuluessa tilauksesta.
          Poikkeuksista ilmoitetaan erikseen.
        </p>
        <h3 className="text-xl font-medium mb-2">Toimitustavat</h3>
        <p className="mb-4">
          Toimitamme tuotteet Postin tai Matkahuollon kautta. Asiakas voi valita
          toimituksen kotiinkuljetuksena tai noutona lähimmästä noutopisteestä.
        </p>
        <h3 className="text-xl font-medium mb-2">Toimituskulut</h3>
        <p className="mb-4">
          Toimituskulut riippuvat valitusta toimitustavasta ja tilauksen koosta.
          Tarkat toimituskulut näytetään kassalla ennen tilauksen vahvistamista.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Maksukäytännöt</h2>
        <h3 className="text-xl font-medium mb-2">Hyväksytyt maksutavat</h3>
        <p className="mb-4">Hyväksymme seuraavat maksutavat:</p>
        <ul className="list-disc list-inside ml-4 mb-4">
          <li>Luottokortit (Visa, Mastercard)</li>
          <li>MobilePay</li>
          <li>Lasku (Klarna)</li>
        </ul>
        <h3 className="text-xl font-medium mb-2">Maksunvälittäjä</h3>
        <p className="mb-4">
          {/* Maksunvälityspalvelun toteuttajana ja maksupalveluntarjoajana toimii
          Paytrail Oyj (2122839-7) yhteistyössä suomalaisten pankkien ja
          luottolaitosten kanssa. Paytrail Oyj näkyy maksun saajana tiliotteella
          tai korttilaskulla ja välittää maksun kauppiaalle. Paytrail Oyj:llä on
          maksulaitoksen toimilupa. Reklamaatiotapauksissa pyydämme ottamaan
          ensisijaisesti yhteyttä tuotteen toimittajaan. Paytrail Oyj, y-tunnus:
          2122839-7 Innova 2 Lutakonaukio 7 40100 Jyväskylä */}
          Maksunvälittäjä Maksunvälityspalvelun toteuttajana ja
          maksupalveluntarjoajana toimii Stripe. Stripe näkyy maksun saajana
          tiliotteella tai korttilaskulla ja välittää maksun kauppiaalle1 3 .
          Stripe on kansainvälinen, laajasti käytetty ja luotettava toimija1 .
          Kaikki verkkokaupan maksut välittää Stripe1 . Stripellä on
          maksulaitoksen toimilupa. Reklamaatiotapauksissa pyydämme ottamaan
          ensisijaisesti yhteyttä tuotteen toimittajaan. Stripen pääkonttorit
          sijaitsevat San Franciscossa ja Dublinissa2 . Yritys on perustettu
          vuonna 2010 ja on kasvanut nopeasti2 .
        </p>
      </section>

      <section>
        <p className="italic">Nämä ehdot on päivitetty viimeksi: 13.1.2025</p>
      </section>
    </div>
  );
}
