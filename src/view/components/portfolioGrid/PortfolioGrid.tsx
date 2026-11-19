// Grade de fotos do portfólio (canvas de telas): 3 colunas, cantos 8 e, opcionalmente, a
// primeira célula "Adicionar" tracejada.

import { Pressable, View } from "react-native";

import { Icon } from "@/view/components/icon";
import { useDesignSystem } from "@/view/components/themeProvider";
import { Thumbnail } from "@/view/components/thumbnail";
import { Typography } from "@/view/components/typography";
import { componentSizes } from "@/view/theme";

export type PortfolioGridItem = { id: string; imageUrl: string; caption: string | null };

export type PortfolioGridProps = {
    photos: PortfolioGridItem[];
    onOpen: (id: string) => void;
    /** Mostra a célula "Adicionar" no começo. */
    onAdd?: () => void;
};

const COLUNAS = 3;

export const PortfolioGrid = ({ photos, onOpen, onAdd }: PortfolioGridProps) => {
    const { theme } = useDesignSystem();
    const { colors, spacing } = theme;
    const largura = `${(100 - ((COLUNAS - 1) * 1.5)) / COLUNAS}%` as const;
    const altura = componentSizes.portfolio.gridHeight;

    return (
        <View style={{ flexDirection: "row", flexWrap: "wrap", columnGap: "1.5%", rowGap: spacing.xs }}>
            {onAdd ? (
                <Pressable
                    onPress={onAdd}
                    accessibilityRole="button"
                    accessibilityLabel="Adicionar foto ao portfólio"
                    style={{
                        width: largura,
                        height: altura,
                        borderRadius: theme.shapes.small,
                        borderWidth: 2,
                        borderStyle: "dashed",
                        borderColor: colors.outline,
                        alignItems: "center",
                        justifyContent: "center",
                        gap: spacing.xs,
                    }}
                >
                    <Icon name="plus" size={spacing.xxl} color={colors.primary} />
                    <Typography variant="labelLarge" color="primary">
                        Adicionar
                    </Typography>
                </Pressable>
            ) : null}
            {photos.map((foto) => (
                <Pressable
                    key={foto.id}
                    onPress={() => onOpen(foto.id)}
                    accessibilityRole="button"
                    accessibilityLabel={`Foto: ${foto.caption ?? "corte"}`}
                    accessibilityHint="Abre a foto"
                    style={{ width: largura }}
                >
                    <Thumbnail uri={foto.imageUrl} label={foto.caption ?? "Foto do portfólio"} width="100%" height={altura} radius={theme.shapes.small} />
                </Pressable>
            ))}
        </View>
    );
};
