import { Stack } from "expo-router";

import { DesignSystemProvider, useDesignSystem } from "@/view/components/themeProvider";

const StackComTema = () => {
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
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="barbeiros" options={{ title: "Barbeiros" }} />
      <Stack.Screen name="barbearias" options={{ headerShown: false }} />
      <Stack.Screen name="agendamento/novo" options={{ headerShown: false }} />
      <Stack.Screen name="agendamentos" options={{ headerShown: false }} />
      <Stack.Screen name="minhas-barbearias/index" options={{ headerShown: false }} />
      <Stack.Screen name="barbearia/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="barbeiro/[id]" options={{ title: "Barbeiro" }} />
      <Stack.Screen name="perfil" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="cadastro" options={{ title: "Criar conta" }} />
      <Stack.Screen name="recuperar-senha" options={{ title: "Recuperar senha" }} />
      <Stack.Screen name="redefinir-senha" options={{ title: "Redefinir senha" }} />
    </Stack>
  );
};

const RootLayout = () => (
  <DesignSystemProvider>
    <StackComTema />
  </DesignSystemProvider>
);

export default RootLayout;
