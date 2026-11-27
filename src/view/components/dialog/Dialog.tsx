// Diálogo básico do Material 3 (dialog.md): título, texto de apoio, conteúdo opcional (ex.: um
// campo) e as ações alinhadas à direita. Tocar fora ou voltar fecha.

import type { ReactNode } from "react";
import { KeyboardAvoidingView, Modal, Platform, Pressable, View } from "react-native";

import { useDesignSystem } from "@/view/components/themeProvider";
import { Typography } from "@/view/components/typography";
import { overlay } from "@/view/theme";

export type DialogProps = {
    visible: boolean;
    title: string;
    supportingText?: string;
    onDismiss: () => void;
    children?: ReactNode;
    /** Botões de texto (Cancelar, confirmar). */
    actions: ReactNode;
};

export const Dialog = ({ visible, title, supportingText, onDismiss, children, actions }: DialogProps) => {
    const { theme } = useDesignSystem();
    const { colors, spacing } = theme;

    return (
        <Modal transparent visible={visible} animationType="fade" onRequestClose={onDismiss} statusBarTranslucent>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={{ flex: 1, justifyContent: "center", padding: spacing.xxl }}
            >
                <Pressable
                    onPress={onDismiss}
                    accessibilityRole="button"
                    accessibilityLabel="Fechar"
                    style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, backgroundColor: overlay.scrim, opacity: overlay.scrimOpacity }}
                />
                <View
                    accessibilityViewIsModal
                    style={{ gap: spacing.lg, padding: spacing.xxl, borderRadius: theme.shapes.extraLarge, backgroundColor: colors.surfaceContainerHigh }}
                >
                    <Typography variant="headlineSmall" accessibilityRole="header">
                        {title}
                    </Typography>
                    {supportingText ? (
                        <Typography variant="bodyMedium" color="onSurfaceVariant">
                            {supportingText}
                        </Typography>
                    ) : null}
                    {children}
                    <View style={{ flexDirection: "row", justifyContent: "flex-end", gap: spacing.sm }}>{actions}</View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};
