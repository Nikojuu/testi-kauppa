import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tietosuojakäytäntö",
  description:
    "Tietosuojakäytäntö kuvaa, kuinka käsittelemme henkilötietoja verkkokaupan yhteydessä.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Tietosuojakäytäntö | Pupun Korvat",
    type: "website",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-screen-2xl p-8 mt-48">
      <h1 className="text-3xl font-bold mb-6">Tietosuojakäytäntö</h1>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">Johdanto</h2>
        <p>
          Tämä tietosuojakäytäntö kuvaa, kuinka käsittelemme henkilötietoja
          verkkokaupan yhteydessä. Noudatamme EU:n yleistä tietosuoja-asetusta
          (GDPR) ja muuta sovellettavaa tietosuojalainsäädäntöä henkilötietojen
          suojaamiseksi.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">Kerättävät tiedot</h2>
        <p>
          Verkkokaupan yhteydessä kerätään ja käsitellään seuraavia
          henkilötietoja:
        </p>
        <ul className="list-disc list-inside ml-4">
          <li>Nimi</li>
          <li>Osoite (laskutus- ja toimitusosoite)</li>
          <li>Sähköpostiosoite</li>
          <li>Puhelinnumero</li>
          <li>Maksutiedot (esim. luottokortti- tai maksupalvelutiedot)</li>
          <li>IP-osoite ja selaustiedot</li>
          <li>Ostoshistoria ja mieltymykset</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">
          Tietojen käsittelyn tarkoitus
        </h2>
        <p>Henkilötietoja käytetään seuraaviin tarkoituksiin:</p>
        <ul className="list-disc list-inside ml-4">
          <li>Tilausten käsittely ja toimitus</li>
          <li>Maksujen käsittely ja turvallisuuden varmistaminen</li>
          <li>Asiakaspalvelun tarjoaminen</li>
          <li>Verkkokaupan käytön analysointi ja kehittäminen</li>
          <li>
            Markkinointi, suostumuksella, kuten uutiskirjeet ja
            kampanjatiedotteet
          </li>
          <li>
            Lain vaatimusten noudattaminen (esim. kirjanpito- ja
            verotusvelvoitteet)
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">Tietojen säilytys</h2>
        <p>
          Henkilötietoja säilytetään niin kauan kuin on tarpeellista niiden
          käsittelytarkoitusten täyttämiseksi tai lain edellyttämällä tavalla
          (esimerkiksi kirjanpitoaineiston säilyttämisvelvollisuus).
          Säilytysaika voi vaihdella sen mukaan, mihin tietoja käytetään ja mitä
          lainsäädäntö vaatii.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">Tietojen jakaminen</h2>
        <p>Henkilötietoja voidaan jakaa seuraavien tahojen kanssa:</p>
        <ul className="list-disc list-inside ml-4">
          <li>
            Maksupalveluntarjoajat ja logistiikkayritykset tilausten käsittelyä
            ja toimitusta varten
          </li>
          <li>
            Verkkokaupan palveluntarjoajat, kuten alustan ylläpitäjät ja
            tietojen käsittelyyn liittyvät kumppanit
          </li>
          <li>
            Lain edellyttämät viranomaiset, mikäli tietojen luovuttaminen on
            pakollista
          </li>
        </ul>
        <p>
          Henkilötietoja ei myydä tai luovuteta kolmansille osapuolille
          markkinointitarkoituksiin ilman suostumusta.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">Evästeet</h2>
        <p>
          Verkkokauppa käyttää evästeitä käyttäjäkokemuksen parantamiseen,
          verkkosivun toiminnallisuuden tukemiseen ja verkkokaupan käytön
          analysointiin. Evästeillä kerätään tietoja esimerkiksi sivustolla
          vierailluista sivuista, selaustavoista ja käytetyistä laitteista.
          Käyttäjä voi hallita evästeiden käyttöä selaimen asetusten kautta.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">Oikeudet</h2>
        <p>
          Rekisteröidyllä on seuraavat oikeudet henkilötietojen käsittelyyn
          liittyen:
        </p>
        <ul className="list-disc list-inside ml-4">
          <li>Oikeus saada pääsy omiin henkilötietoihin</li>
          <li>Oikeus pyytää tietojen oikaisemista tai poistamista</li>
          <li>Oikeus rajoittaa tietojen käsittelyä tai vastustaa käsittelyä</li>
          <li>
            Oikeus peruuttaa suostumus tietojen käsittelyyn, mikäli käsittely
            perustuu suostumukseen
          </li>
          <li>
            Oikeus tehdä valitus valvontaviranomaiselle, mikäli kokee
            henkilötietojen käsittelyn olevan lainvastaista
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">Yhteystiedot</h2>
        <p>
          Tietosuojakäytäntöön liittyvissä kysymyksissä tai omien
          henkilötietojen käsittelyä koskevien oikeuksien käyttämiseksi,
          rekisteröidyn tulee ottaa yhteyttä yritykseen:
        </p>
        <p className="mt-2">
          <strong>Sähköposti:</strong>{" "}
          <a
            href="mailto:info@example.com"
            className="text-blue-600 hover:underline"
          >
            info@example.com
          </a>
        </p>
      </section>

      <section>
        <p>
          Tämä tietosuojakäytäntö päivitetään tarvittaessa. Mahdolliset
          muutokset julkaistaan verkkosivustolla, ja rekisteröityjä kehotetaan
          tarkistamaan tietosuojakäytännön ajantasaisuus säännöllisesti.
        </p>
        <p className="mt-4">
          <strong>Viimeisin päivitys:</strong> [Lisää päivämäärä]
        </p>
      </section>
    </div>
  );
}
