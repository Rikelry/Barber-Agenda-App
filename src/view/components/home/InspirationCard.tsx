// Card da galeria "Inspirações" do Início: foto do corte com o nome sobreposto na base, sobre um
// véu escuro, e um botão de seta indicando que abre os detalhes. O card inteiro é um botão.

import { Pressable, View } from "react-native";

import { Icon } from "@/view/components/icon";
import { useDesignSystem } from "@/view/components/themeProvider";
import { Thumbnail } from "@/view/components/thumbnail";
import { Typography } from "@/view/components/typography";
import { componentSizes, overlay, withAlpha } from "@/view/theme";

export type InspirationCardProps = {
    title: string;
    imageUrl: string;
    /** Para o leitor de tela, ex.: "por Alessandro". */
    author: string;
    onPress: () => void;
};

export const InspirationCard = ({ title, imageUrl, author, onPress }: InspirationCardProps) => {
    const { theme } = useDesignSystem();
    const { colors, spacing } = theme;

    return (
        <Pressable
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={`${title}, ${author}`}
            accessibilityHint="Abre os detalhes da inspiração"
            style={({ pressed }) => ({
                width: componentSizes.home.inspirationWidth,
                height: componentSizes.home.inspirationHeight,
                borderRadius: theme.shapes.large,
                overflow: "hidden",
                opacity: pressed ? 1 - theme.state.pressed : 1,
            })}
        >
            <Thumbnail uri={imageUrl} label={`Foto do corte ${title}`} width="100%" height="100%" radius={theme.shapes.none} />
            <View
                style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: spacing.sm,
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.sm,
                    backgroundColor: withAlpha(overlay.scrim, overlay.scrimOpacity),
                }}
            >
                <Typography variant="titleSmall" numberOfLines={2} style={{ color: overlay.onScrim, flex: 1 }}>
                    {title}
                </Typography>
                <View
                    style={{
                        width: spacing.xxl,
                        height: spacing.xxl,
                        borderRadius: theme.shapes.full,
                        backgroundColor: colors.secondary,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Icon name="arrowForward" size={spacing.lg} color={colors.onSecondary} />
                </View>
            </View>
        </Pressable>
    );
};
