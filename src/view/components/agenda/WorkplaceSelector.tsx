// Seletor compacto de barbearia (aba Trabalho): botão com o nome e a seta que abre um menu do
// Material 3 logo abaixo, com a escolhida marcada. Com uma barbearia só, mostra o nome sem toque.

import { useRef, useState, type ComponentRef } from "react";
import { Modal, Pressable, View } from "react-native";

import { Icon } from "@/view/components/icon";
import { useDesignSystem } from "@/view/components/themeProvider";
import { Typography } from "@/view/components/typography";
import { componentSizes } from "@/view/theme";

export type WorkplaceOption = { id: string; name: string };

export type WorkplaceSelectorProps = {
    options: WorkplaceOption[];
    selectedId: string | null;
    onSelect: (id: string) => void;
};

export const WorkplaceSelector = ({ options, selectedId, onSelect }: WorkplaceSelectorProps) => {
    const { theme } = useDesignSystem();
    const { colors, spacing } = theme;
    const [menu, setMenu] = useState<{ top: number; left: number } | null>(null);
    const botao = useRef<ComponentRef<typeof View>>(null);
    const atual = options.find((o) => o.id === selectedId);
    const varias = options.length > 1;

    const abrir = () =>
        botao.current?.measureInWindow((x: number, y: number, _w: number, h: number) => setMenu({ top: y + h + spacing.xs, left: x }));

    return (
        <>
            <Pressable
                ref={botao}
                onPress={abrir}
                disabled={!varias}
                accessibilityRole={varias ? "button" : "text"}
                accessibilityLabel={`Barbearia: ${atual?.name ?? ""}`}
                accessibilityHint={varias ? "Abre a lista para trocar de barbearia" : undefined}
                style={({ pressed }) => ({
                    alignSelf: "flex-start",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: spacing.xs,
                    minHeight: componentSizes.segmentedButton.height,
                    paddingLeft: spacing.md,
                    paddingRight: varias ? spacing.sm : spacing.md,
                    borderRadius: theme.shapes.small,
                    borderWidth: 1,
                    borderColor: colors.outlineVariant,
                    backgroundColor: pressed ? colors.surfaceContainerHighest : colors.surface,
                })}
            >
                <Icon name="store" size={componentSizes.segmentedButton.icon} color={colors.onSurfaceVariant} />
                <Typography variant="labelLarge" numberOfLines={1}>
                    {atual?.name ?? "Barbearia"}
                </Typography>
                {varias ? <Icon name="expandMore" size={spacing.xl} color={colors.onSurfaceVariant} /> : null}
            </Pressable>
            <Modal transparent visible={menu !== null} animationType="fade" onRequestClose={() => setMenu(null)}>
                <Pressable style={{ flex: 1 }} onPress={() => setMenu(null)} accessibilityRole="button" accessibilityLabel="Fechar menu">
                    <View
                        accessibilityRole="menu"
                        style={[
                            {
                                position: "absolute",
                                top: menu?.top ?? 0,
                                left: menu?.left ?? 0,
                                minWidth: componentSizes.avatar.large * 2,
                                paddingVertical: spacing.sm,
                                borderRadius: theme.shapes.extraSmall,
                                backgroundColor: colors.surfaceContainer,
                            },
                            theme.getElevationStyle("level2", colors.shadow),
                        ]}
                    >
                        {options.map((o) => {
                            const escolhida = o.id === selectedId;
                            return (
                                <Pressable
                                    key={o.id}
                                    accessibilityRole="menuitem"
                                    accessibilityState={{ selected: escolhida }}
                                    onPress={() => {
                                        setMenu(null);
                                        onSelect(o.id);
                                    }}
                                    style={({ pressed }) => ({
                                        flexDirection: "row",
                                        alignItems: "center",
                                        gap: spacing.md,
                                        minHeight: componentSizes.touchTarget,
                                        paddingHorizontal: spacing.md,
                                        backgroundColor: pressed || escolhida ? colors.secondaryContainer : "transparent",
                                    })}
                                >
                                    {escolhida ? (
                                        <Icon name="checkmark" size={spacing.xl} color={colors.onSecondaryContainer} />
                                    ) : (
                                        <View style={{ width: spacing.xl }} />
                                    )}
                                    <Typography variant="bodyLarge" color={escolhida ? "onSecondaryContainer" : "onSurface"}>
                                        {o.name}
                                    </Typography>
                                </Pressable>
                            );
                        })}
                    </View>
                </Pressable>
            </Modal>
        </>
    );
};
