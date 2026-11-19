import { Stack } from "expo-router";

import { useDesignSystem } from "@/view/components/themeProvider";

// Telas de quem ainda não entrou: sem barra inferior (tab-bar.md, "quando não usar").
const AuthLayout = () => {
  const { theme } = useDesignSystem();
  const { colors } = theme;
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.onSurface,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="cadastro" options={{ headerShown: false }} />
      <Stack.Screen name="recuperar-senha" options={{ headerShown: false }} />
      <Stack.Screen name="redefinir-senha" options={{ headerShown: false }} />
    </Stack>
  );
};

export default AuthLayout;
