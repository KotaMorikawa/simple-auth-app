import React from "react";
import { View, StyleSheet } from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { signUpSchema, type SignUpInput } from "../../lib/validations/auth";

interface SignUpFormProps {
  onSubmit: (data: SignUpInput) => Promise<void>;
  isLoading?: boolean;
}

export function SignUpForm({ onSubmit, isLoading }: SignUpFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  return (
    <View style={styles.container}>
      <Input
        control={control}
        name="name"
        label="名前"
        placeholder="山田 太郎"
        error={errors.name?.message}
      />
      <Input
        control={control}
        name="email"
        label="メールアドレス"
        placeholder="your@email.com"
        error={errors.email?.message}
      />
      <Input
        control={control}
        name="password"
        label="パスワード"
        secureTextEntry
        error={errors.password?.message}
      />
      <Input
        control={control}
        name="confirmPassword"
        label="パスワード（確認）"
        secureTextEntry
        error={errors.confirmPassword?.message}
      />
      <Button
        label="アカウント作成"
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
