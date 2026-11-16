// Foto circular com toque para escolher na galeria (upload-imagem.md).

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
};

export const PhotoPicker = ({ uri, label, onPick, disabled = false }: PhotoPickerProps) => {
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
                <Icon name="upload" size={spacing.xxxl} color={colors.onPrimaryContainer} />
                {uri ? <Image source={{ uri }} style={StyleSheet.absoluteFill} contentFit="cover" /> : null}
            </View>
            <Typography variant="labelLarge" color="primary">
                {uri ? "Trocar foto" : label}
            </Typography>
        </Pressable>
    );
};
