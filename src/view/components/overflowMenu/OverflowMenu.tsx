// Menu ⋮: botão que abre uma lista de opções sobre a tela; tocar fora fecha.

import { useState } from "react";
import { Modal, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Icon } from "@/view/components/icon";
import { IconButton } from "@/view/components/iconButton";
import { useDesignSystem } from "@/view/components/themeProvider";
import { Typography } from "@/view/components/typography";
import { componentSizes } from "@/view/theme";

export type OverflowMenuItem = { key: string; label: string; onPress: () => void };

export type OverflowMenuProps = { items: OverflowMenuItem[]; accessibilityLabel?: string };

export const OverflowMenu = ({ items, accessibilityLabel = "Mais opções" }: OverflowMenuProps) => {
    const { theme } = useDesignSystem();
    const { colors, spacing } = theme;
    const insets = useSafeAreaInsets();
    const [aberto, setAberto] = useState(false);

    return (
        <>
            <IconButton
                accessibilityLabel={accessibilityLabel}
                onPress={() => setAberto(true)}
                icon={(cor) => <Icon name="moreVert" color={cor} />}
            />
            <Modal transparent visible={aberto} animationType="fade" onRequestClose={() => setAberto(false)}>
                <Pressable
                    style={{ flex: 1 }}
                    onPress={() => setAberto(false)}
                    accessibilityRole="button"
                    accessibilityLabel="Fechar menu"
                >
                    <View
                        accessibilityRole="menu"
                        style={[
                            {
                                position: "absolute",
                                top: insets.top + componentSizes.touchTarget,
                                right: spacing.md,
                                minWidth: componentSizes.avatar.large * 2,
                                paddingVertical: spacing.xs,
                                borderRadius: theme.shapes.extraSmall,
                                backgroundColor: colors.surfaceContainer,
                            },
                            theme.getElevationStyle("level2", colors.shadow),
                        ]}
                    >
                        {items.map((item) => (
                            <Pressable
                                key={item.key}
                                accessibilityRole="menuitem"
                                onPress={() => {
                                    setAberto(false);
                                    item.onPress();
                                }}
                                style={({ pressed }) => ({
                                    minHeight: componentSizes.touchTarget,
                                    justifyContent: "center",
                                    paddingHorizontal: spacing.lg,
                                    backgroundColor: pressed ? colors.surfaceContainerHighest : "transparent",
                                })}
                            >
                                <Typography variant="bodyLarge">{item.label}</Typography>
                            </Pressable>
                        ))}
                    </View>
                </Pressable>
            </Modal>
        </>
    );
};
