// Avatar (design-system/04-componentes/avatar.md): foto circular ou a inicial do nome quando
// não há foto, enquanto ela carrega ou se falhar.

import { Image } from "expo-image";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { useDesignSystem } from "@/view/components/themeProvider";
import { Typography } from "@/view/components/typography";
import { componentSizes, type AvatarSize } from "@/view/theme";

export type AvatarProps = {
    /** Nome da pessoa: vira o accessibilityLabel e a inicial do placeholder. */
    name: string;
    uri?: string | null;
    size?: AvatarSize;
    /** Anel na cor primária em volta da foto (perfil). */
    outlined?: boolean;
};

const VARIANTE_INICIAL = {
    small: "labelLarge",
    medium: "titleMedium",
    large: "headlineMedium",
} as const;

export const Avatar = ({ name, uri, size = "medium", outlined = false }: AvatarProps) => {
    const { theme } = useDesignSystem();
    const [falhou, setFalhou] = useState(false);
    const lado = componentSizes.avatar[size];
    const mostrarFoto = Boolean(uri) && !falhou;
    const anel = outlined ? theme.spacing.xs / 2 : theme.spacing.none;

    return (
        <View
            accessible
            accessibilityRole="image"
            accessibilityLabel={`Foto de ${name}`}
            style={{
                width: lado + anel * 2,
                height: lado + anel * 2,
                borderRadius: theme.shapes.full,
                borderWidth: anel,
                borderColor: theme.colors.primary,
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <View
            style={{
                width: lado,
                height: lado,
                borderRadius: theme.shapes.full,
                backgroundColor: theme.colors.surfaceVariant,
                overflow: "hidden",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            {/* A inicial fica por baixo: aparece enquanto a foto carrega e se ela falhar. */}
            <Typography variant={VARIANTE_INICIAL[size]} color="onSurfaceVariant">
                {name.trim().charAt(0).toUpperCase() || "?"}
            </Typography>
            {mostrarFoto ? (
                <Image
                    source={{ uri: uri ?? undefined }}
                    style={StyleSheet.absoluteFill}
                    contentFit="cover"
                    transition={theme.motion.duration.short4}
                    onError={() => setFalhou(true)}
                />
            ) : null}
            </View>
        </View>
    );
};
