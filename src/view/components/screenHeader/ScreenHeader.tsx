// Cabeçalho de tela: voltar, título e ação opcional à direita (ex.: menu ⋮).

import type { ReactNode } from "react";
import { View } from "react-native";

import { Icon } from "@/view/components/icon";
import { IconButton } from "@/view/components/iconButton";
import { useDesignSystem } from "@/view/components/themeProvider";
import { Typography } from "@/view/components/typography";

export type ScreenHeaderProps = {
    title: string;
    onBack?: () => void;
    right?: ReactNode;
};

export const ScreenHeader = ({ title, onBack, right }: ScreenHeaderProps) => {
    const { theme } = useDesignSystem();
    return (
        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
                gap: theme.spacing.sm,
                paddingHorizontal: onBack ? theme.spacing.sm : theme.spacing.lg,
                paddingVertical: theme.spacing.xs,
            }}
        >
            {onBack ? (
                <IconButton accessibilityLabel="Voltar" onPress={onBack} icon={(cor) => <Icon name="back" color={cor} />} />
            ) : null}
            <Typography variant="titleLarge" numberOfLines={1} accessibilityRole="header" style={{ flex: 1 }}>
                {title}
            </Typography>
            {right}
        </View>
    );
};
