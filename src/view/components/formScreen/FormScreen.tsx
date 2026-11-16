// Esqueleto das telas de formulário: conteúdo com rolagem e a ação principal fixa no rodapé
// (princípio 1: uma ação principal clara). O teclado empurra o rodapé no iOS.

import type { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useDesignSystem } from "@/view/components/themeProvider";

export type FormScreenProps = {
    children: ReactNode;
    /** Ação principal (normalmente um Button filled fullWidth). */
    footer: ReactNode;
};

export const FormScreen = ({ children, footer }: FormScreenProps) => {
    const { theme } = useDesignSystem();
    const { colors, spacing } = theme;
    const insets = useSafeAreaInsets();

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: colors.background }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <ScrollView
                contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}
                keyboardShouldPersistTaps="handled"
            >
                {children}
            </ScrollView>
            <View
                style={{
                    paddingHorizontal: spacing.lg,
                    paddingTop: spacing.md,
                    paddingBottom: Math.max(insets.bottom, spacing.lg),
                    gap: spacing.sm,
                }}
            >
                {footer}
            </View>
        </KeyboardAvoidingView>
    );
};
