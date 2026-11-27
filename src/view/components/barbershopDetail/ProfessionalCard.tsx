// Card de profissional do detalhe da barbearia: foto, nome, especialidade e o botão para
// escolher o profissional do agendamento. Tocar no card abre o perfil dele.

import { Platform, Pressable, View } from "react-native";

import { Avatar } from "@/view/components/avatar";
import { Button } from "@/view/components/button";
import { useDesignSystem } from "@/view/components/themeProvider";
import { Typography } from "@/view/components/typography";
import { withAlpha } from "@/view/theme";

export type ProfessionalCardProps = {
    name: string;
    specialty: string | null;
    avatarUrl: string | null;
    selected: boolean;
    onSelect: () => void;
    onOpen: () => void;
};

export const ProfessionalCard = ({ name, specialty, avatarUrl, selected, onSelect, onOpen }: ProfessionalCardProps) => {
    const { theme } = useDesignSystem();
    const { colors, spacing } = theme;

    return (
        <Pressable
            onPress={onOpen}
            accessibilityRole="button"
            accessibilityLabel={`${name}, ${specialty ?? "Barbeiro"}`}
            accessibilityHint="Abre o perfil do profissional"
            android_ripple={{ color: withAlpha(colors.primary, theme.state.pressed) }}
            style={({ pressed }) => ({
                flexDirection: "row",
                alignItems: "center",
                gap: spacing.md,
                padding: spacing.md,
                overflow: "hidden",
                borderRadius: theme.shapes.large,
                borderWidth: selected ? 2 : 0,
                borderColor: colors.primary,
                backgroundColor: colors.surfaceContainer,
                opacity: Platform.OS === "ios" && pressed ? 1 - theme.state.pressed : 1,
                ...theme.getElevationStyle("level1", colors.shadow),
            })}
        >
            <Avatar name={name} uri={avatarUrl} />
            <View style={{ flex: 1 }}>
                <Typography variant="titleMedium" weight="700" numberOfLines={1}>
                    {name}
                </Typography>
                <Typography variant="bodyMedium" color="onSurfaceVariant" numberOfLines={2}>
                    {specialty ?? "Barbeiro"}
                </Typography>
            </View>
            <Button
                variant={selected ? "tonal" : "filled"}
                size="xs"
                onPress={onSelect}
                accessibilityLabel={selected ? `${name} escolhido` : `Escolher ${name} para o agendamento`}
            >
                {selected ? "Escolhido" : "Escolher"}
            </Button>
        </Pressable>
    );
};
