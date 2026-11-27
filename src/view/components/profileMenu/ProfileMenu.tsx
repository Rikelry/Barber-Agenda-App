// Menu do Perfil (perfil-menu.md), no formato do menu da conta Google com Material 3: título da
// seção, um grupo bege de cantos arredondados e itens de lista de duas linhas (ícone num
// círculo tonal, título, descrição e seta). O item inteiro é tocável.

import { Children, Fragment, type ReactNode } from "react";
import { Pressable, View } from "react-native";

import { Icon } from "@/view/components/icon";
import { Thumbnail } from "@/view/components/thumbnail";
import { useDesignSystem } from "@/view/components/themeProvider";
import { Typography } from "@/view/components/typography";
import { componentSizes, withAlpha } from "@/view/theme";

/** Sem title, só o grupo (ex.: módulos logo abaixo do cartão da barbearia). */
export type ProfileSectionProps = { title?: string; children: ReactNode };

/** Título da seção (CONTA, TRABALHO...) e o grupo de itens. */
export const ProfileSection = ({ title, children }: ProfileSectionProps) => {
    const { theme } = useDesignSystem();
    const { colors, spacing } = theme;
    const itens = Children.toArray(children);

    return (
        <View style={{ gap: spacing.sm }}>
            {title ? (
                <Typography
                    variant="labelLarge"
                    weight="700"
                    color="secondary"
                    accessibilityRole="header"
                    style={{ paddingHorizontal: spacing.xs, letterSpacing: 0.8 }}
                >
                    {title.toUpperCase()}
                </Typography>
            ) : null}
            <View style={{ borderRadius: theme.shapes.extraLarge, overflow: "hidden", backgroundColor: colors.surfaceContainer }}>
                {itens.map((item, i) => (
                    <Fragment key={i}>
                        {i > 0 ? (
                            <View style={{ height: 1, marginLeft: componentSizes.profileMenu.dividerInset, backgroundColor: colors.outlineVariant }} />
                        ) : null}
                        {item}
                    </Fragment>
                ))}
            </View>
        </View>
    );
};

export type ProfileMenuItemProps = {
    icon: string;
    title: string;
    description?: string;
    onPress: () => void;
    /** Ação destrutiva (Sair da conta): ícone e título em vermelho, sem seta. */
    destructive?: boolean;
};

export const ProfileMenuItem = ({ icon, title, description, onPress, destructive = false }: ProfileMenuItemProps) => {
    const { theme } = useDesignSystem();
    const { colors, spacing } = theme;
    const cor = destructive ? colors.error : colors.onSecondaryContainer;

    return (
        <Pressable
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={description ? `${title}, ${description}` : title}
            android_ripple={{ color: withAlpha(colors.onSurface, theme.state.pressed) }}
            style={({ pressed }) => ({
                flexDirection: "row",
                alignItems: "center",
                gap: spacing.lg,
                minHeight: componentSizes.profileMenu.itemHeight,
                paddingHorizontal: spacing.lg,
                paddingVertical: spacing.md,
                backgroundColor: pressed ? withAlpha(colors.onSurface, theme.state.pressed) : "transparent",
            })}
        >
            <View
                style={{
                    width: componentSizes.touchTarget - spacing.xs,
                    height: componentSizes.touchTarget - spacing.xs,
                    borderRadius: theme.shapes.full,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: destructive ? colors.errorContainer : colors.secondaryContainer,
                }}
            >
                <Icon name={icon} size={spacing.xxl} color={cor} />
            </View>
            <View style={{ flex: 1, gap: spacing.xs / 2 }}>
                <Typography variant="bodyLarge" weight="500" color={destructive ? "error" : "onSurface"}>
                    {title}
                </Typography>
                {description ? (
                    <Typography variant="bodyMedium" color="onSurfaceVariant">
                        {description}
                    </Typography>
                ) : null}
            </View>
            {destructive ? null : <Icon name="chevronRight" size={spacing.xxl} color={colors.onSurfaceVariant} />}
        </Pressable>
    );
};

export type ProfileBarbershopCardProps = {
    name: string;
    imageUrl: string | null;
    onPress: () => void;
};

/** Cartão de identificação da barbearia do dono: foto, nome, "Gerencie seu estabelecimento" e seta. */
export const ProfileBarbershopCard = ({ name, imageUrl, onPress }: ProfileBarbershopCardProps) => {
    const { theme } = useDesignSystem();
    const { colors, spacing } = theme;
    const lado = componentSizes.profileMenu.barbershopImage;

    return (
        <Pressable
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={`${name}, gerencie seu estabelecimento`}
            android_ripple={{ color: withAlpha(colors.onPrimaryContainer, theme.state.pressed) }}
            style={({ pressed }) => ({
                flexDirection: "row",
                alignItems: "center",
                gap: spacing.lg,
                padding: spacing.md,
                paddingRight: spacing.lg,
                overflow: "hidden",
                borderRadius: theme.shapes.extraLarge,
                backgroundColor: pressed ? withAlpha(colors.primaryContainer, 1 - theme.state.pressed) : colors.primaryContainer,
            })}
        >
            <Thumbnail
                uri={imageUrl}
                label={`Foto da ${name}`}
                width={lado}
                height={lado}
                radius={theme.shapes.large}
                placeholder={<Icon name="store" size={spacing.xxxl} color={colors.onPrimaryContainer} />}
            />
            <View style={{ flex: 1, gap: spacing.xs / 2 }}>
                <Typography variant="titleMedium" weight="700" color="onPrimaryContainer" numberOfLines={2}>
                    {name}
                </Typography>
                <Typography variant="bodyMedium" color="onSurfaceVariant">
                    Gerencie seu estabelecimento
                </Typography>
            </View>
            <Icon name="chevronRight" size={spacing.xxl} color={colors.onPrimaryContainer} />
        </Pressable>
    );
};
