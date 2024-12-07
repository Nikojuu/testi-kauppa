import * as React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
} from "@react-email/components";

interface ContactFormEmailProps {
  firstName: string;
  lastName?: string;
  email: string;
  message: string;
}

export const ContactFormEmail: React.FC<ContactFormEmailProps> = ({
  firstName,
  lastName,
  email,
  message,
}) => {
  return (
    <Html lang="en">
      <Head />
      <Body style={mainStyle}>
        <Container>
          <Section>
            <Text style={headerStyle}>
              Olet saanut uuden Yhteydenottopyynnön
            </Text>
          </Section>
          <Hr style={hrStyle} />
          <Section>
            <Text style={labelStyle}>Nimi:</Text>
            <Text style={contentStyle}>
              {firstName} {lastName}
            </Text>

            <Text style={labelStyle}>Email:</Text>
            <Text style={contentStyle}>{email}</Text>

            <Text style={labelStyle}>Viesti:</Text>
            <Text style={contentStyle}>{message}</Text>
          </Section>
          <Hr style={hrStyle} />
        </Container>
      </Body>
    </Html>
  );
};

export default ContactFormEmail;

const mainStyle = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const headerStyle = {
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center" as const,
  color: "#333",
};

const labelStyle = {
  fontSize: "16px",
  fontWeight: "bold",
  color: "#555",
};

const contentStyle = {
  fontSize: "16px",
  color: "#333",
  marginBottom: "24px",
};

const hrStyle = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};
