// Card horizontal de barbearia (lista vertical "Barbearias em destaque"): foto à esquerda
// (~38% da largura) e, à direita, nome, local, distância, nota, status e seta. O card inteiro é
// um botão. Nota, avaliações, distância e status só aparecem quando existem.

import { Platform, Pressable, StyleSheet, View } from "react-native";

import { Icon } from "@/view/components/icon";
import { useDesignSystem } from "@/view/components/themeProvider";
import { Thumbnail } from "@/view/components/thumbnail";
import { Typography } from "@/view/components/typography";
import { componentSizes, overlay, statusColors, withAlpha } from "@/view/theme";

export type BarbershopCardProps = {
    name: string;
    location: string;
    imageUrl: string | null;
    rating: number | null;
    reviewCount: number | null;
    distanceKm: number | null;
    /** null: sem horário cadastrado, o status não aparece. */
    isOpen: boolean | null;
    onPress: () => void;
};

/** "Barbearia Don Corleone" → "DC": iniciais das duas primeiras palavras, sem "Barbearia". */
const monograma = (nome: string) =>
    nome
        .split(/\s+/)
        .filter((p) => p && !/^barbearia$/i.test(p) && !/^(da|de|do|das|dos|e)$/i.test(p))
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase() ?? "")
        .join("") || "B";

const umaCasa = (n: number) => n.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export const BarbershopCard = ({
    name,
    location,
    imageUrl,
    rating,
    reviewCount,
    distanceKm,
    isOpen,
    onPress,
}: BarbershopCardProps) => {
    const { theme } = useDesignSystem();
    const { colors, spacing } = theme;
    const local = distanceKm === null ? location : `${location} · ${umaCasa(distanceKm)} km`;
    const avaliacoes = reviewCount === null ? "" : ` (${reviewCount} ${reviewCount === 1 ? "avaliação" : "avaliações"})`;
    const status = isOpen === null ? "" : isOpen ? ", aberto agora" : ", fechado agora";
    const nota = rating === null ? "" : `, nota ${umaCasa(rating)}${avaliacoes}`;
    const iconeLinha = spacing.lg + spacing.xs;

    return (
        <Pressable
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={`${name}, ${local}${nota}${status}`}
            accessibilityHint="Abre os detalhes da barbearia"
            android_ripple={{ color: withAlpha(colors.primary, theme.state.pressed) }}
            style={({ pressed }) => ({
                flexDirection: "row",
                minHeight: componentSizes.home.barbershopMinHeight,
                borderRadius: theme.shapes.large,
                borderWidth: 1,
                borderColor: colors.outlineVariant,
                backgroundColor: colors.surfaceContainer,
                overflow: "hidden",
                opacity: Platform.OS === "ios" && pressed ? 1 - theme.state.pressed : 1,
            })}
        >
            {/* A foto preenche a altura que o texto define; absoluta para não entrar na medida. */}
            <View style={{ width: componentSizes.home.barbershopImageWidth }}>
                <View style={StyleSheet.absoluteFill}>
                    <Thumbnail
                        uri={imageUrl}
                        label={`Foto da ${name}`}
                        width="100%"
                        height="100%"
                        radius={theme.shapes.none}
                        placeholder={<BarbershopPlaceholder name={name} />}
                    />
                </View>
            </View>

            <View
                style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: spacing.md,
                    paddingLeft: spacing.md,
                    paddingRight: spacing.sm,
                    gap: spacing.sm,
                }}
            >
                <View style={{ flex: 1, gap: spacing.xs }}>
                    <Typography variant="titleMedium" weight="700" numberOfLines={2}>
                        {name}
                    </Typography>
                    <View style={{ flexDirection: "row", alignItems: "flex-start", gap: spacing.xs }}>
                        <Icon name="location" size={iconeLinha} color={colors.onSurfaceVariant} style={{ marginTop: spacing.xs / 2 }} />
                        <Typography variant="bodyMedium" color="onSurfaceVariant" numberOfLines={2} style={{ flexShrink: 1 }}>
                            {local}
                        </Typography>
                    </View>
                    {rating !== null ? (
                        <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.xs }}>
                            <Icon name="star" size={iconeLinha} color={colors.secondary} />
                            <Typography variant="bodyMedium" numberOfLines={1} style={{ flexShrink: 1 }}>
                                <Typography variant="bodyMedium" weight="700">
                                    {umaCasa(rating)}
                                </Typography>
                                {avaliacoes}
                            </Typography>
                        </View>
                    ) : null}
                    {isOpen !== null ? <OpenNowBadge open={isOpen} /> : null}
                </View>
                <View
                    style={{
                        width: spacing.xxxl,
                        height: spacing.xxxl,
                        borderRadius: theme.shapes.full,
                        backgroundColor: colors.secondaryContainer,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Icon name="chevronRight" size={spacing.xl} color={colors.onSecondaryContainer} />
                </View>
            </View>
        </Pressable>
    );
};

/** Sem foto cadastrada: monograma da barbearia sobre bege, com um ícone discreto de loja. */
const BarbershopPlaceholder = ({ name }: { name: string }) => {
    const { theme } = useDesignSystem();
    const { colors, spacing } = theme;
    return (
        <View
            style={[
                StyleSheet.absoluteFill,
                { backgroundColor: colors.secondaryContainer, alignItems: "center", justifyContent: "center", gap: spacing.xs },
            ]}
        >
            <Typography variant="headlineMedium" weight="700" color="secondary">
                {monograma(name)}
            </Typography>
            <Icon name="store" size={spacing.xl} color={colors.secondary} />
        </View>
    );
};

export type OpenNowBadgeProps = { open: boolean };

/**
 * Selo "Aberto agora"/"Fechado agora": fundo tonal com ponto verde (ou contorno quando fechado).
 * O texto fica na cor do texto principal: verde sobre o verde claro não chega a 4,5:1.
 */
export const OpenNowBadge = ({ open }: OpenNowBadgeProps) => {
    const { theme } = useDesignSystem();
    const { colors, spacing } = theme;
    const verde = statusColors.confirmed.container;
    const lado = componentSizes.home.statusDot;

    return (
        <View
            style={{
                alignSelf: "flex-start",
                flexDirection: "row",
                alignItems: "center",
                gap: spacing.xs + spacing.xs / 2,
                paddingHorizontal: spacing.sm + spacing.xs / 2,
                paddingVertical: spacing.xs / 2,
                borderRadius: theme.shapes.full,
                backgroundColor: open ? withAlpha(verde, overlay.statusTint) : colors.surfaceContainerHighest,
            }}
        >
            <View style={{ width: lado, height: lado, borderRadius: theme.shapes.full, backgroundColor: open ? verde : colors.outline }} />
            <Typography variant="labelMedium" weight="700" color="onSurface">
                {open ? "Aberto agora" : "Fechado agora"}
            </Typography>
        </View>
    );
};
