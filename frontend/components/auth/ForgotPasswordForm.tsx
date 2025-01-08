import React from "react";
import { View, StyleSheet } from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "../../lib/validations/auth";

interface ForgotPasswordFormProps {
  onSubmit: (data: ForgotPasswordInput) => Promise<void>;
  isLoading?: boolean;
}

export function ForgotPasswordForm({
  onSubmit,
  isLoading,
}: ForgotPasswordFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  return (
    <View style={styles.container}>
      <Input
        control={control}
        name="email"
        label="メールアドレス"
        placeholder="your@email.com"
        error={errors.email?.message}
      />
      <Button
        label="リセットリンクを送信"
        onPress={handleSubmit(onSubmit)}
        loading={isLoading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
});
