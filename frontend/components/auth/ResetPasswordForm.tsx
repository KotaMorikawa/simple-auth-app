import React from "react";
import { View, StyleSheet } from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "../../lib/validations/auth";

interface ResetPasswordFormProps {
  onSubmit: (data: ResetPasswordInput) => Promise<void>;
  isLoading?: boolean;
}

export function ResetPasswordForm({
  onSubmit,
  isLoading,
}: ResetPasswordFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  return (
    <View style={styles.container}>
      <Input
        control={control}
        name="password"
        label="新しいパスワード"
        secureTextEntry
        error={errors.password?.message}
      />
      <Input
        control={control}
        name="confirmPassword"
        label="新しいパスワード（確認）"
        secureTextEntry
        error={errors.confirmPassword?.message}
      />
      <Button
        label="パスワードを変更"
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
