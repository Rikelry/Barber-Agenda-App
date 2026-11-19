import { Tabs } from "expo-router";

import { useDesignSystem } from "@/view/components/themeProvider";

// Áreas principais do app. Cada tela desenha a própria MainTabBar, que mostra as abas do papel
// de quem entrou (useTabBarViewModel); por isso a barra padrão do navegador fica escondida.
const TabsLayout = () => {
  const { theme } = useDesignSystem();
  return (
    <Tabs
      tabBar={() => null}
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: theme.colors.background } }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="barbearias" />
      <Tabs.Screen name="agendamentos" />
      <Tabs.Screen name="agenda" />
      <Tabs.Screen name="gestao" />
      <Tabs.Screen name="perfil" />
    </Tabs>
  );
};

export default TabsLayout;
