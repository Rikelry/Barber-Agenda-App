// Imagem de barbearia ou serviço, com ícone de tesoura enquanto carrega, sem foto ou se ela falhar.

import { Image } from "expo-image";
import { useState } from "react";
import { StyleSheet, View, type DimensionValue } from "react-native";

import { Icon } from "@/view/components/icon";
import { useDesignSystem } from "@/view/components/themeProvider";

export type ThumbnailProps = {
    uri?: string | null;
    /** Texto para leitor de tela (ex.: "Foto da Barbearia Central"). */
    label: string;
    width: DimensionValue;
    height: number;
};

export const Thumbnail = ({ uri, label, width, height }: ThumbnailProps) => {
    const { theme } = useDesignSystem();
    const [falhou, setFalhou] = useState(false);

    return (
        <View
            accessible
            accessibilityRole="image"
            accessibilityLabel={label}
            style={{
                width,
                height,
                borderRadius: theme.shapes.medium,
                overflow: "hidden",
                backgroundColor: theme.colors.primaryContainer,
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            {/* O ícone fica por baixo: aparece enquanto a foto carrega e se ela falhar. */}
            <Icon name="scissors" size={theme.spacing.xxxl} color={theme.colors.onPrimaryContainer} />
            {uri && !falhou ? (
                <Image
                    source={{ uri }}
                    style={StyleSheet.absoluteFill}
                    contentFit="cover"
                    transition={theme.motion.duration.short4}
                    onError={() => setFalhou(true)}
                />
            ) : null}
        </View>
    );
};
