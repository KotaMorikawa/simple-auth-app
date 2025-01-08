import React from "react";
import { View, StyleSheet } from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { signInSchema, type SignInInput } from "../../lib/validations/auth";

interface SignInFormProps {
  onSubmit: (data: SignInInput) => Promise<void>;
  isLoading?: boolean;
  requiresOTP?: boolean;
}

export function SignInForm({
  onSubmit,
  isLoading,
  requiresOTP,
}: SignInFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      code: "",
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
      <Input
        control={control}
        name="password"
        label="パスワード"
        secureTextEntry
        error={errors.password?.message}
      />
      {requiresOTP && (
        <Input
          control={control}
          name="code"
          label="認証コード"
          placeholder="Enter OTP"
          error={errors.code?.message}
        />
      )}
      <Button
        label="ログイン"
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
