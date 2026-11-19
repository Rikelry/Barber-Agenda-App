// Abas da tela (tabs.md): variante "linha" para telas de detalhe (Serviços, Profissionais) e
// "segmentada" para filtros (Próximos, Histórico), como no canvas de telas.

import { Pressable, View } from "react-native";

import { Icon } from "@/view/components/icon";
import { useDesignSystem } from "@/view/components/themeProvider";
import { Typography } from "@/view/components/typography";
import { componentSizes } from "@/view/theme";

export type TabsItem<K extends string> = { key: K; label: string };

export type TabsProps<K extends string> = {
    items: TabsItem<K>[];
    selected: K;
    onSelect: (key: K) => void;
    variant?: "line" | "segmented";
};

export const Tabs = <K extends string>({ items, selected, onSelect, variant = "line" }: TabsProps<K>) => {
    const { theme } = useDesignSystem();
    const { colors, spacing } = theme;
    const segmentada = variant === "segmented";

    return (
        <View
            accessibilityRole="tablist"
            style={
                segmentada
                    ? { flexDirection: "row", borderWidth: 1, borderColor: colors.outline, borderRadius: theme.shapes.small, overflow: "hidden" }
                    : { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: colors.outlineVariant }
            }
        >
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
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: spacing.xs,
                            ...(segmentada
                                ? {
                                      backgroundColor: ativo ? colors.secondaryContainer : "transparent",
                                      borderLeftWidth: i > 0 ? 1 : 0,
                                      borderLeftColor: colors.outline,
                                  }
                                : {
                                      borderBottomWidth: componentSizes.tabs.indicator,
                                      borderBottomColor: ativo ? colors.primary : "transparent",
                                  }),
                        }}
                    >
                        {segmentada && ativo ? <Icon name="checkmark" size={spacing.lg} color={colors.onSecondaryContainer} /> : null}
                        <Typography
                            variant="labelLarge"
                            style={{
                                color: segmentada
                                    ? colors.onSurface
                                    : ativo
                                      ? colors.primary
                                      : colors.onSurfaceVariant,
                            }}
                        >
                            {item.label}
                        </Typography>
                    </Pressable>
                );
            })}
        </View>
    );
};
