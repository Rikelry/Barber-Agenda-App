// Abas da tela (tabs.md, Material 3 primary tabs): linha inferior na aba ativa. Para escolher
// entre 2 a 5 opções (Próximos | Histórico, Serviços | Profissionais) use o SegmentedButton.

import { Pressable, View } from "react-native";

import { useDesignSystem } from "@/view/components/themeProvider";
import { Typography } from "@/view/components/typography";
import { componentSizes } from "@/view/theme";

export type TabsItem<K extends string> = { key: K; label: string };

export type TabsProps<K extends string> = {
    items: TabsItem<K>[];
    selected: K;
    onSelect: (key: K) => void;
};

export const Tabs = <K extends string>({ items, selected, onSelect }: TabsProps<K>) => {
    const { theme } = useDesignSystem();
    const { colors, spacing } = theme;

    return (
        <View accessibilityRole="tablist" style={{ flexDirection: "row", borderBottomWidth: 1, borderBottomColor: colors.outlineVariant }}>
            {items.map((item, i) => {
                const ativo = item.key === selected;
                return (
                    <Pressable
                        key={item.key}
                        onPress={() => onSelect(item.key)}
                        accessibilityRole="tab"
                        accessibilityLabel={`${item.label}, aba ${i + 1} de ${items.length}`}
                        accessibilityState={{ selected: ativo }}
                        style={{
                            flex: 1,
                            minHeight: componentSizes.touchTarget,
                            alignItems: "center",
                            justifyContent: "center",
                            gap: spacing.xs,
                            borderBottomWidth: componentSizes.tabs.indicator,
                            borderBottomColor: ativo ? colors.primary : "transparent",
                        }}
                    >
                        <Typography variant="labelLarge" style={{ color: ativo ? colors.primary : colors.onSurfaceVariant }}>
                            {item.label}
                        </Typography>
                    </Pressable>
                );
            })}
        </View>
    );
};
