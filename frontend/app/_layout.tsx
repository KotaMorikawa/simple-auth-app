import React from "react";
import { Stack, Redirect, Slot, router } from "expo-router";
import { AuthProvider, useAuth } from "../lib/contexts/auth";
import { LoadingScreen } from "../components/ui/LoadingScreen";

function RootLayoutNav() {
  const { isLoading, isAuthenticated } = useAuth();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/sign-in");
    }
  }, [isLoading, isAuthenticated]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
