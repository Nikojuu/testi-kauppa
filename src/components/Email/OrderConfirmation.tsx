import * as React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Row,
  Column,
  Heading,
  Text,
  Hr,
  Img,
} from "@react-email/components";
import {
  CustomerData,
  Product,
  shipmentMethod,
  ShopInfo,
} from "@/app/utils/sendOrderConfirmationEmail";

export function OrderConfirmationEmail({
  customerData,
  orderItems,
  shopInfo,
  shipmentMethod,
  orderNumber,
}: {
  customerData: CustomerData;
  orderItems: Product[];
  shipmentMethod: shipmentMethod;
  shopInfo: ShopInfo;
  orderNumber: number;
}) {
  const totalOrderPrice = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const currentDate = new Date().toLocaleDateString("fi-FI", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <Html lang="en">
      <Head />
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.logoSection}>
            {/* Replace the placeholder with your company logo field in database */}
            <img
              src="https://via.placeholder.com/150x50?text=Your+Logo"
              alt="Your Company Logo"
              width={150}
              height={50}
            />
          </Section>
          <Section style={styles.mainSection}>
            <Heading style={styles.heading}>
              Kiitos tilauksestasi, {customerData.first_name}!
            </Heading>
            <Text style={styles.paragraph}>
              Tilauksesi on vastaanotettu ja käsitellään pian.
            </Text>
            <Text style={styles.paragraph}>
              Tilauksen päivämäärä: {currentDate}
              <br />
              Tilausnumero: {orderNumber}
            </Text>
            <Section style={styles.orderDetails}>
              <Heading as="h2" style={styles.subheading}>
                Tilauksen tiedot
              </Heading>
              {orderItems.map((item, index) => (
                <Row key={index} style={styles.orderItem}>
                  <Column style={styles.imageColumn}>
                    <Img
                      src={
                        item.images ||
                        "https://via.placeholder.com/80x80?text=No+Image"
                      }
                      alt={item.name}
                      width={80}
                      height={80}
                      style={styles.productImage}
                    />
                  </Column>
                  <Column style={styles.detailsColumn}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemDetails}>
                      {item.quantity} x €{item.price.toFixed(2)}
                    </Text>
                  </Column>
                  <Column style={styles.priceColumn}>
                    <Text style={styles.itemTotal}>
                      €{((item.price / 100) * item.quantity).toFixed(2)}
                    </Text>
                  </Column>
                </Row>
              ))}
              <Hr style={styles.divider} />
              <Row style={styles.totalRow}>
                <Column>
                  <Text style={styles.totalLabel}>Yhteensä</Text>
                </Column>
                <Column align="right">
                  <Text style={styles.totalAmount}>
                    €{(totalOrderPrice / 100).toFixed(2)}
                  </Text>
                </Column>
              </Row>
              {/* <Row style={styles.totalRow}>
                <Column>
                  <Text style={styles.totalLabel}>Yhteensä ilman ALV</Text>
                </Column>
                <Column align="right">
                  <Text style={styles.totalAmount}>
                    €{totalPriceWithoutVAT.toFixed(2)}
                  </Text>
                </Column>
              </Row> */}
            </Section>
            <Section style={styles.shippingDetails}>
              <Heading as="h2" style={styles.subheading}>
                Toimitustapa {shipmentMethod.name}
              </Heading>
              <Text style={styles.paragraph}>
                {customerData.first_name} {customerData.last_name}
                <br />
                {customerData.address}
                <br />
                {customerData.city}, {customerData.postal_code}
              </Text>
            </Section>
            <Hr style={styles.divider} />
            <Text style={styles.paragraph}>
              Jos sinulla on kysyttävää tilauksestasi, ota yhteyttä osoitteeseen{" "}
              {shopInfo.email}.
            </Text>
          </Section>
          <Section style={styles.footer}>
            <Text style={styles.footerText}>
              Kiitos käynnistä! Tervetuloa uudelleen!
            </Text>
            <Text style={styles.footerText}>
              {shopInfo.Store.name}
              <br />
              Puhelin: {shopInfo.phone}
              <br />
              Sähköposti: {shopInfo.email}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const styles = {
  body: {
    backgroundColor: "#f6f9fc",
    fontFamily:
      '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  },
  container: {
    margin: "0 auto",
    padding: "20px 0 48px",
    width: "560px",
  },
  logoSection: {
    padding: "20px",
    textAlign: "center" as const,
  },
  mainSection: {
    backgroundColor: "#ffffff",
    borderRadius: "5px",
    padding: "40px",
  },
  heading: {
    fontSize: "32px",
    lineHeight: "1.3",
    fontWeight: "700",
    color: "#484848",
  },
  subheading: {
    fontSize: "20px",
    lineHeight: "1.3",
    fontWeight: "700",
    color: "#484848",
    marginTop: "16px",
    marginBottom: "8px",
  },
  paragraph: {
    fontSize: "16px",
    lineHeight: "1.4",
    color: "#484848",
    marginBottom: "16px",
  },
  productImage: {
    borderRadius: "4px",
    objectFit: "contain" as const,
  },
  orderDetails: {
    backgroundColor: "#f9f9f9",
    borderRadius: "4px",
    padding: "16px",
    marginBottom: "24px",
  },
  orderItem: {
    marginBottom: "16px",
  },
  imageColumn: {
    width: "80px",
    paddingRight: "16px",
  },
  detailsColumn: {
    paddingRight: "16px",
  },
  priceColumn: {
    width: "80px",
    textAlign: "right" as const,
  },
  itemName: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#484848",
    margin: "0 0 4px 0",
  },
  itemDetails: {
    fontSize: "14px",
    color: "#777",
    margin: "0",
  },
  itemTotal: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#484848",
    margin: "0",
  },
  divider: {
    borderTop: "1px solid #e6ebf1",
    margin: "16px 0",
  },
  totalRow: {
    marginTop: "8px",
  },
  totalLabel: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#484848",
  },
  totalAmount: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#484848",
  },
  shippingDetails: {
    marginBottom: "24px",
  },
  button: {
    backgroundColor: "#5469d4",
    borderRadius: "4px",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "600",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "block",
    width: "100%",
    padding: "12px 0",
  },
  footer: {
    textAlign: "center" as const,
    padding: "20px",
  },
  footerText: {
    fontSize: "12px",
    color: "#777",
  },
};

export default OrderConfirmationEmail;
