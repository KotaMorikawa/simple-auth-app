import React, { createContext, useContext, useState } from "react";
import * as SecureStore from "expo-secure-store";

interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  signIn: (token: string, user: User) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (user: User) => Promise<void>;
  isAuthenticated: boolean;
  isVerified: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
  });

  const isAuthenticated = Boolean(state.token);
  const isVerified = Boolean(state.user?.emailVerified);

  React.useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const [token, userJson] = await Promise.all([
        SecureStore.getItemAsync("auth_token"),
        SecureStore.getItemAsync("auth_user"),
      ]);

      if (token && userJson) {
        const user = JSON.parse(userJson);
        setState({ user, token, isLoading: false });
      } else {
        setState({ user: null, token: null, isLoading: false });
      }
    } catch (error) {
      console.error("認証情報の読み込みに失敗しました:", error);
      setState({ user: null, token: null, isLoading: false });
    }
  };

  const signIn = async (token: string, user: User) => {
    try {
      await Promise.all([
        SecureStore.setItemAsync("auth_token", token),
        SecureStore.setItemAsync("auth_user", JSON.stringify(user)),
      ]);
      setState({ user, token, isLoading: false });
    } catch (error) {
      console.error("認証情報の保存に失敗しました:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await Promise.all([
        SecureStore.deleteItemAsync("auth_token"),
        SecureStore.deleteItemAsync("auth_user"),
      ]);
      setState({ user: null, token: null, isLoading: false });
    } catch (error) {
      console.error("認証情報の削除に失敗しました:", error);
      throw error;
    }
  };

  const updateUser = async (user: User) => {
    try {
      await SecureStore.setItemAsync("auth_user", JSON.stringify(user));
      setState((prev) => ({ ...prev, user }));
    } catch (error) {
      console.error("ユーザー情報の更新に失敗しました:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signOut,
        updateUser,
        isAuthenticated,
        isVerified,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
