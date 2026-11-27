// Card de serviço do detalhe da barbearia: foto do serviço à esquerda, nome, duração e descrição
// curta ao centro e, à direita, o preço em destaque e o botão Agendar.

import { View } from "react-native";

import { Button } from "@/view/components/button";
import { Icon } from "@/view/components/icon";
import { useDesignSystem } from "@/view/components/themeProvider";
import { Thumbnail } from "@/view/components/thumbnail";
import { Typography } from "@/view/components/typography";
import { componentSizes } from "@/view/theme";

export type ServiceCardProps = {
    name: string;
    /** Ex.: "30 min". */
    duration: string;
    description: string | null;
    /** Ex.: "R$ 40,00". */
    price: string;
    imageUrl: string | null;
    onBook: () => void;
};

export const ServiceCard = ({ name, duration, description, price, imageUrl, onBook }: ServiceCardProps) => {
    const { theme } = useDesignSystem();
    const { colors, spacing } = theme;
    const lado = componentSizes.barbershopDetail.serviceImage;

    return (
        <View
            style={{
                flexDirection: "row",
                gap: spacing.md,
                padding: spacing.md,
                borderRadius: theme.shapes.large,
                backgroundColor: colors.surfaceContainer,
                ...theme.getElevationStyle("level1", colors.shadow),
            }}
        >
            <Thumbnail uri={imageUrl} label={`Foto do serviço ${name}`} width={lado} height={lado} radius={theme.shapes.medium} />

            <View style={{ flex: 1, gap: spacing.xs }}>
                <Typography variant="titleMedium" weight="700" numberOfLines={2}>
                    {name}
                </Typography>
                <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.xs }}>
                    <Icon name="clock" size={spacing.lg} color={colors.onSurfaceVariant} />
                    <Typography variant="bodySmall" color="onSurfaceVariant">
                        {duration}
                    </Typography>
                </View>
                {description ? (
                    <Typography variant="bodyMedium" color="onSurfaceVariant" numberOfLines={2}>
                        {description}
                    </Typography>
                ) : null}
            </View>

            <View style={{ alignItems: "flex-end", justifyContent: "space-between", gap: spacing.sm }}>
                <Typography variant="titleMedium" weight="700" color="primary">
                    {price}
                </Typography>
                <Button variant="filled" size="xs" onPress={onBook} accessibilityLabel={`Agendar ${name}, ${price}`}>
                    Agendar
                </Button>
            </View>
        </View>
    );
};
