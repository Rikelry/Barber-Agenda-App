// Foto circular com toque para escolher na galeria (upload-imagem.md). Com title, mostra o nome
// embaixo e um botão de câmera discreto sobre a foto no lugar do texto "Trocar foto".

import { Image } from "expo-image";
import { Pressable, StyleSheet, View } from "react-native";

import { Icon } from "@/view/components/icon";
import { useDesignSystem } from "@/view/components/themeProvider";
import { Typography } from "@/view/components/typography";
import { componentSizes } from "@/view/theme";

export type PhotoPickerProps = {
    uri: string | null;
    label: string;
    onPick: () => void;
    disabled?: boolean;
    /** Nome mostrado abaixo da foto (ex.: nome da barbearia). */
    title?: string;
    /** Linha de apoio abaixo do nome. */
    subtitle?: string;
};

export const PhotoPicker = ({ uri, label, onPick, disabled = false, title, subtitle }: PhotoPickerProps) => {
    const { theme } = useDesignSystem();
    const { colors, spacing } = theme;
    const lado = componentSizes.avatar.large;

    return (
        <Pressable
            onPress={onPick}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityLabel={uri ? `Trocar ${label.toLowerCase()}` : label}
            style={{ alignItems: "center", gap: spacing.sm, opacity: disabled ? theme.state.disabledContent : 1 }}
        >
            <View
                style={{
                    width: lado,
                    height: lado,
                    borderRadius: theme.shapes.full,
                    overflow: "hidden",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: colors.primaryContainer,
                }}
            >
                <Icon name={title !== undefined ? "store" : "upload"} size={spacing.xxxl} color={colors.onPrimaryContainer} />
                {uri ? <Image source={{ uri }} style={StyleSheet.absoluteFill} contentFit="cover" /> : null}
            </View>
            {title !== undefined ? (
                <>
                    {/* Botão de câmera sobre a borda da foto (ação discreta de trocar). */}
                    <View
                        accessibilityElementsHidden
                        importantForAccessibility="no-hide-descendants"
                        style={{
                            position: "absolute",
                            top: lado - componentSizes.photoPicker.badge + spacing.xs,
                            left: "50%",
                            marginLeft: lado / 2 - componentSizes.photoPicker.badge + spacing.xs,
                            width: componentSizes.photoPicker.badge,
                            height: componentSizes.photoPicker.badge,
                            borderRadius: theme.shapes.full,
                            borderWidth: spacing.xs / 2 + 1,
                            borderColor: colors.background,
                            backgroundColor: colors.primary,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Icon name="camera" size={spacing.lg + spacing.xs / 2} color={colors.onPrimary} />
                    </View>
                    <View style={{ alignItems: "center", gap: spacing.xs / 2, paddingTop: spacing.xs }}>
                        <Typography variant="titleLarge" weight="700" align="center" numberOfLines={2}>
                            {title || "Sua barbearia"}
                        </Typography>
                        {subtitle ? (
                            <Typography variant="bodyMedium" color="onSurfaceVariant" align="center">
                                {subtitle}
                            </Typography>
                        ) : null}
                    </View>
                </>
            ) : (
                <Typography variant="labelLarge" color="primary">
                    {uri ? "Trocar foto" : label}
                </Typography>
            )}
        </Pressable>
    );
};
