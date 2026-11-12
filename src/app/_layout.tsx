import { Stack } from "expo-router";

import { DesignSystemProvider as DesignSystemSrcProvider } from "@/design-system";
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
      <Stack.Screen name="barbearia/[id]" options={{ title: "Barbearia" }} />
      <Stack.Screen name="barbeiro/[id]" options={{ title: "Barbeiro" }} />
      <Stack.Screen name="perfil" options={{ headerShown: false }} />
    </Stack>
  );
};

const RootLayout = () => (
  <DesignSystemProvider>
    {/* A tela de perfil usa os componentes de src/design-system, que têm o próprio provider. */}
    <DesignSystemSrcProvider>
      <StackComTema />
    </DesignSystemSrcProvider>
  </DesignSystemProvider>
);

export default RootLayout;
