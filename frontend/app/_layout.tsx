import React from "react";
import { Slot, router } from "expo-router";
import { AuthProvider, useAuth } from "../lib/contexts/auth";
import { LoadingScreen } from "../components/ui/LoadingScreen";
import * as Linking from "expo-linking";

function RootLayoutNav() {
  const { isLoading, isAuthenticated } = useAuth();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/sign-in");
    }
  }, [isLoading, isAuthenticated]);

  // ディープリンクの処理
  React.useEffect(() => {
    // 初期URLの処理
    Linking.getInitialURL().then((url) => {
      if (url && isAuthenticated) {
        const { path, queryParams } = Linking.parse(url);
        handleDeepLinkNavigation(
          path as string,
          queryParams as Record<string, string>
        );
      }
    });

    // バックグラウンドからの復帰時
    const subscription = Linking.addEventListener("url", ({ url }) => {
      if (isAuthenticated) {
        const { path, queryParams } = Linking.parse(url);
        handleDeepLinkNavigation(
          path as string,
          queryParams as Record<string, string>
        );
      }
    });

    return () => subscription.remove();
  }, [isAuthenticated]);

  // ディープリンクのナビゲーション処理
  const handleDeepLinkNavigation = (
    path: string,
    params: Record<string, string>
  ) => {
    switch (path) {
      case "callback":
        // トークンの処理
        const token = params.token;
        if (token) {
          // トークンに応じた処理
          router.push({
            pathname: "/profile", // 実際のアプリの有効なルートに変更
            params: { token },
          });
        }
        break;
      default:
        console.log("Unknown path:", path);
    }
  };

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
