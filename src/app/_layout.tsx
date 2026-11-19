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
      {/* Grupos: (tabs) tem a barra inferior; (auth) é login, cadastro e senha. O resto são sub-telas sem barra. */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="barbeiros" options={{ title: "Barbeiros" }} />
      <Stack.Screen name="agendamento/novo" options={{ headerShown: false }} />
      <Stack.Screen name="indisponibilidades" options={{ headerShown: false }} />
      <Stack.Screen name="meu-trabalho" options={{ headerShown: false }} />
      <Stack.Screen name="minhas-barbearias/nova" options={{ headerShown: false }} />
      <Stack.Screen name="minhas-barbearias/[id]/index" options={{ headerShown: false }} />
      <Stack.Screen name="minhas-barbearias/[id]/horarios" options={{ headerShown: false }} />
      <Stack.Screen name="minhas-barbearias/[id]/profissionais" options={{ headerShown: false }} />
      <Stack.Screen name="minhas-barbearias/[id]/servicos" options={{ headerShown: false }} />
      <Stack.Screen name="barbearia/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="barbeiro/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="perfil/dados" options={{ headerShown: false }} />
      <Stack.Screen name="perfil/senha" options={{ headerShown: false }} />
    </Stack>
  );
};

const RootLayout = () => (
  <DesignSystemProvider>
    <StackComTema />
  </DesignSystemProvider>
);

export default RootLayout;
