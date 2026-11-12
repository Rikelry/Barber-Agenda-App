import { Image } from "expo-image";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { useDesignSystem } from "../../providers/DesignSystemProvider";
import { Typography } from "../typography";

import type { AvatarProps, AvatarSize } from "./Avatar.types";

/** avatar.md: pequeno 32 dp (listas compactas), médio 48 dp (listas e Home), grande 96 dp (perfil). */
export const avatarDimensions: Record<AvatarSize, number> = {
    small: 32,
    medium: 48,
    large: 96,
};

const initialVariant = {
    small: "labelLarge",
    medium: "titleMedium",
    large: "headlineMedium",
} as const;

export function Avatar({ name, uri, size = "medium", outlined = false }: AvatarProps) {
    const { theme } = useDesignSystem();
    const [failed, setFailed] = useState(false);
    const dimension = avatarDimensions[size];
    const ring = outlined ? theme.spacing.xs / 2 : 0;

    return (
        <View
            accessible
            accessibilityRole="image"
            accessibilityLabel={`Foto de ${name}`}
            style={{
                width: dimension + ring * 2,
                height: dimension + ring * 2,
                borderRadius: theme.shapes.full,
                borderWidth: ring,
                borderColor: theme.colors.primary,
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <View
                style={{
                    width: dimension,
                    height: dimension,
                    borderRadius: theme.shapes.full,
                    backgroundColor: theme.colors.surfaceVariant,
                    overflow: "hidden",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {/* A inicial fica por baixo: aparece enquanto a foto carrega e se ela falhar. */}
                <Typography variant={initialVariant[size]} color="onSurfaceVariant">
                    {name.trim().charAt(0).toUpperCase() || "?"}
                </Typography>
                {uri && !failed ? (
                    <Image
                        source={{ uri }}
                        style={StyleSheet.absoluteFill}
                        contentFit="cover"
                        transition={theme.motion.duration.short4}
                        onError={() => setFailed(true)}
                    />
                ) : null}
            </View>
        </View>
    );
}
