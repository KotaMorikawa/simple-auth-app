import React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from "@react-email/components";

interface VerificationEmailProps {
  email: string;
  confirmLink: string;
}

export const VerificationEmail = ({
  email,
  confirmLink,
}: VerificationEmailProps) => (
  <Html>
    <Head />
    <Preview>確認メールの送信</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>確認メールの送信</Heading>
        <Text style={text}>
          ◆
          このメールは、ログイン時にご入力いただいたメールアドレス宛に自動的にお送りしています。
          <Link href={confirmLink} style={link}>
            こちらのリンク
          </Link>
          をクリックして、メールアドレスの確認を完了してください。
        </Text>
        <Text style={text}>{confirmLink}</Text>
        <Text style={notice}>
          ※
          アプリが自動的に開かない場合は、リンクをコピーしてブラウザに貼り付けてください。
        </Text>
        <Text style={notice}>
          ※ スマートフォンのGmailアプリをご利用の場合： 1.
          リンクを長押しして「リンクをコピー」 2. ブラウザで開いてください
        </Text>
        <Text style={footer}>このメールは {email} 宛に送信されました。</Text>
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
  textAlign: "center" as const,
};

const text = {
  color: "#333",
  lineHeight: "1.6",
};

const link = {
  color: "#2563eb",
};

const footer = {
  color: "#666",
  marginTop: "20px",
  fontSize: "12px",
};

const notice = {
  color: "#e11d48",
  fontSize: "14px",
  marginTop: "15px",
  lineHeight: "1.4",
};
