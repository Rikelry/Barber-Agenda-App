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
      <Stack.Screen name="barbearia/[id]" options={{ title: "Barbearia" }} />
      <Stack.Screen name="barbeiro/[id]" options={{ title: "Barbeiro" }} />
    </Stack>
  );
};

const RootLayout = () => (
  <DesignSystemProvider>
    <StackComTema />
  </DesignSystemProvider>
);

export default RootLayout;
