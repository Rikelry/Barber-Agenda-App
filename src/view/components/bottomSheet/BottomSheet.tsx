// Bottom sheet modal do Material 3 (bottom-sheet.md): sobe sobre um scrim que fecha ao tocar,
// com alça de arrasto (arrastar para baixo fecha), título e botão Fechar para leitores de tela.
// O conteúdo rola quando passa da altura máxima.

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Animated, Modal, PanResponder, Pressable, ScrollView, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Icon } from "@/view/components/icon";
import { IconButton } from "@/view/components/iconButton";
import { useDesignSystem } from "@/view/components/themeProvider";
import { Typography } from "@/view/components/typography";
import { componentSizes, overlay } from "@/view/theme";

export type BottomSheetProps = {
    visible: boolean;
    title: string;
    onClose: () => void;
    children: ReactNode;
    /** Ações fixas no rodapé (ex.: Enviar sugestão). */
    footer?: ReactNode;
};

export const BottomSheet = ({ visible, title, onClose, children, footer }: BottomSheetProps) => {
    const { theme } = useDesignSystem();
    const { colors, spacing } = theme;
    const insets = useSafeAreaInsets();
    const { height } = useWindowDimensions();
    // useState com inicializador: o valor animado e o gesto são criados uma vez só.
    const [arrasto] = useState(() => new Animated.Value(0));
    useEffect(() => {
        if (visible) arrasto.setValue(0);
    }, [visible, arrasto]);

    // Arrastar não re-renderiza a tela (só o valor animado muda), então o gesto não é recriado no meio.
    const gesto = useMemo(
        () =>
            PanResponder.create({
                // A alça e o título respondem ao toque; o botão Fechar (filho) tem prioridade.
                onStartShouldSetPanResponder: () => true,
                onMoveShouldSetPanResponder: (_, g) => g.dy > spacing.xs && Math.abs(g.dy) > Math.abs(g.dx),
                onPanResponderMove: (_, g) => arrasto.setValue(Math.max(0, g.dy)),
                onPanResponderRelease: (_, g) => {
                    if (g.dy > componentSizes.agenda.sheetDismissDrag) onClose();
                    else Animated.spring(arrasto, { toValue: 0, useNativeDriver: true }).start();
                },
            }),
        [arrasto, onClose, spacing.xs],
    );

    return (
        <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose} statusBarTranslucent>
            <View style={{ flex: 1, justifyContent: "flex-end" }}>
                <Pressable
                    onPress={onClose}
                    accessibilityRole="button"
                    accessibilityLabel="Fechar"
                    style={[StyleFill, { backgroundColor: overlay.scrim, opacity: overlay.scrimOpacity }]}
                />
                <Animated.View
                    accessibilityViewIsModal
                    style={{
                        maxHeight: height * componentSizes.agenda.sheetMaxRatio,
                        paddingBottom: insets.bottom + spacing.lg,
                        borderTopLeftRadius: theme.shapes.extraLargeTop,
                        borderTopRightRadius: theme.shapes.extraLargeTop,
                        backgroundColor: colors.surfaceContainerLow,
                        transform: [{ translateY: arrasto }],
                    }}
                >
                    <View {...gesto.panHandlers}>
                        <View style={{ alignItems: "center", paddingTop: spacing.md, paddingBottom: spacing.xs }}>
                            <View
                                style={{
                                    width: componentSizes.agenda.sheetHandleWidth,
                                    height: componentSizes.agenda.sheetHandleHeight,
                                    borderRadius: theme.shapes.full,
                                    backgroundColor: colors.onSurfaceVariant,
                                    opacity: theme.state.disabledContent,
                                }}
                            />
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center", paddingLeft: spacing.xxl, paddingRight: spacing.sm }}>
                            <Typography variant="titleLarge" accessibilityRole="header" style={{ flex: 1 }} numberOfLines={1}>
                                {title}
                            </Typography>
                            <IconButton accessibilityLabel="Fechar" onPress={onClose} icon={(cor) => <Icon name="close" color={cor} />} />
                        </View>
                    </View>
                    <ScrollView
                        bounces={false}
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={{
                            paddingHorizontal: spacing.xxl,
                            paddingTop: spacing.sm,
                            paddingBottom: spacing.lg,
                            gap: spacing.lg,
                        }}
                    >
                        {children}
                    </ScrollView>
                    {footer ? <View style={{ paddingHorizontal: spacing.xxl, gap: spacing.sm }}>{footer}</View> : null}
                </Animated.View>
            </View>
        </Modal>
    );
};

const StyleFill = { position: "absolute", top: 0, right: 0, bottom: 0, left: 0 } as const;
