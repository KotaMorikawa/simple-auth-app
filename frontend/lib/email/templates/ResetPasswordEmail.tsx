import React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Button,
  Section,
} from "@react-email/components";

interface ResetPasswordEmailProps {
  name: string;
  resetUrl: string;
}

export function ResetPasswordEmail({
  name,
  resetUrl,
}: ResetPasswordEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section>
            <Text style={styles.heading}>パスワードのリセット</Text>
            <Text style={styles.text}>
              {name}様、パスワードリセットのリクエストを受け付けました。
            </Text>
            <Text style={styles.text}>
              以下のボタンをクリックして、新しいパスワードを設定してください。
            </Text>
            <Button style={styles.button} href={resetUrl}>
              パスワードをリセット
            </Button>
            <Text style={styles.text}>
              このメールに心当たりがない場合は、無視していただいて構いません。
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
    backgroundColor: "#ffffff",
    margin: "0 auto",
    padding: "40px 0",
    marginTop: "32px",
    borderRadius: "4px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  heading: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "16px",
    textAlign: "center" as const,
  },
  text: {
    fontSize: "16px",
    lineHeight: "24px",
    color: "#333",
    marginBottom: "16px",
    textAlign: "center" as const,
  },
  button: {
    backgroundColor: "#3B82F6",
    borderRadius: "4px",
    color: "#fff",
    fontSize: "16px",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "block",
    width: "100%",
    padding: "12px 0",
    marginTop: "24px",
    marginBottom: "24px",
  },
};
