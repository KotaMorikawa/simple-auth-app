import React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "@react-email/components";

interface OTPEmailProps {
  name: string;
  otp: string;
}

export const OTPEmail = ({ name, otp }: OTPEmailProps) => (
  <Html>
    <Head />
    <Preview>認証コード</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>認証コード</Heading>
        <Text style={text}>こんにちは {name} さん</Text>
        <Text style={text}>あなたの認証コードは：</Text>
        <Text style={otpText}>{otp}</Text>
        <Text style={footer}>このコードは10分間有効です。</Text>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: "#ffffff",
  fontFamily: "Arial, sans-serif",
};

const container = {
  margin: "0 auto",
  padding: "20px",
  maxWidth: "600px",
};

const h1 = {
  color: "#2563eb",
};

const text = {
  color: "#333",
  lineHeight: "1.6",
};

const otpText = {
  backgroundColor: "#f3f4f6",
  padding: "20px",
  borderRadius: "5px",
  textAlign: "center" as const,
  fontSize: "24px",
  letterSpacing: "5px",
};

const footer = {
  color: "#666",
  marginTop: "20px",
};
