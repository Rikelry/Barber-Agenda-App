// Topo do detalhe da barbearia: foto em largura total (cerca de 29% da altura da tela) com os
// cantos inferiores arredondados, botão voltar redondo sobre a foto e, na base, um degradê
// escuro com nome, nota (quando houver), endereço, horário de hoje, status e telefone.

import { Image } from "expo-image";
import { Pressable, StyleSheet, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Icon } from "@/view/components/icon";
import { OpenBadge } from "@/view/components/statusBadge";
import { useDesignSystem } from "@/view/components/themeProvider";
import { Thumbnail } from "@/view/components/thumbnail";
import { Typography } from "@/view/components/typography";
import { componentSizes, overlay, withAlpha } from "@/view/theme";

const DEGRADE = require("@/assets/images/barbearia/degrade-escuro.svg");

export type BarbershopHeroProps = {
    name: string;
    imageUrl: string | null;
    address: string;
    /** Ex.: "09:00 às 20:00" ou "Fechada hoje". */
    hoursLabel: string;
    openNow: boolean;
    /** Telefone já formatado; vazio não mostra a linha. */
    phone: string;
    rating: number | null;
    reviewCount: number | null;
    onBack: () => void;
};

export const BarbershopHero = ({
    name,
    imageUrl,
    address,
    hoursLabel,
    openNow,
    phone,
    rating,
    reviewCount,
    onBack,
}: BarbershopHeroProps) => {
    const { theme } = useDesignSystem();
    const { colors, spacing } = theme;
    const insets = useSafeAreaInsets();
    const { height } = useWindowDimensions();
    const alturaFoto = Math.max(componentSizes.barbershopDetail.heroMinHeight, Math.round(height * componentSizes.barbershopDetail.heroRatio));
    const branco = overlay.onScrim;
    const icone = spacing.lg + spacing.xs;

    const linha = (nome: string, texto: string, extra?: React.ReactNode) => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
            <Icon name={nome} size={icone} color={branco} />
            <Typography variant="bodyMedium" numberOfLines={2} style={{ color: branco, flexShrink: 1 }}>
                {texto}
            </Typography>
            {extra}
        </View>
    );

    return (
        <View
            style={{
                height: alturaFoto,
                borderBottomLeftRadius: theme.shapes.extraLarge,
                borderBottomRightRadius: theme.shapes.extraLarge,
                overflow: "hidden",
                backgroundColor: colors.primary,
            }}
        >
            <Thumbnail
                uri={imageUrl}
                label={`Foto da ${name}`}
                width="100%"
                height="100%"
                radius={theme.shapes.none}
                placeholder={<Icon name="store" size={spacing.giant} color={colors.onPrimaryContainer} />}
            />
            <Image
                source={DEGRADE}
                contentFit="fill"
                accessible={false}
                pointerEvents="none"
                style={StyleSheet.absoluteFill}
            />

            <Pressable
                onPress={onBack}
                accessibilityRole="button"
                accessibilityLabel="Voltar"
                hitSlop={spacing.xs}
                style={({ pressed }) => ({
                    position: "absolute",
                    top: insets.top + spacing.sm,
                    left: spacing.lg,
                    width: componentSizes.touchTarget,
                    height: componentSizes.touchTarget,
                    borderRadius: theme.shapes.full,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: withAlpha(overlay.scrim, overlay.controlScrim),
                    opacity: pressed ? 1 - theme.state.pressed : 1,
                })}
            >
                <Icon name="back" size={spacing.xxl} color={branco} />
            </Pressable>

            <View style={{ position: "absolute", left: spacing.lg, right: spacing.lg, bottom: spacing.xl, gap: spacing.xs }}>
                <Typography variant="titleLarge" weight="700" numberOfLines={1} accessibilityRole="header" style={{ color: branco }}>
                    {name}
                </Typography>
                {rating !== null ? (
                    <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.xs }}>
                        <Icon name="star" size={icone} color={colors.primaryFixed} />
                        <Typography variant="bodyMedium" style={{ color: branco }}>
                            <Typography variant="bodyMedium" weight="700" style={{ color: branco }}>
                                {rating.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                            </Typography>
                            {reviewCount !== null ? ` (${reviewCount} avaliações)` : ""}
                        </Typography>
                    </View>
                ) : null}
                {linha("location", address)}
                {linha("clock", hoursLabel, <OpenBadge open={openNow} />)}
                {phone ? linha("phone", phone) : null}
            </View>
        </View>
    );
};
