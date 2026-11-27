// Segmented button (segmented-button.md, Material 3 outlined): 2 a 5 segmentos de mesma largura
// num contêiner de 40 dp com pontas arredondadas e contorno; o selecionado fica em
// secondary-container com ✓. Seleção única (radio) ou múltipla (checkbox).

import { Platform, Pressable, View } from "react-native";

import { Icon } from "@/view/components/icon";
import { useDesignSystem } from "@/view/components/themeProvider";
import { Typography } from "@/view/components/typography";
import { componentSizes, withAlpha } from "@/view/theme";

export type SegmentedButtonSegment<K extends string> = {
    value: K;
    label: string;
    /** Nome do Icon; no segmento selecionado dá lugar ao ✓. */
    icon?: string;
    disabled?: boolean;
};

type Comum<K extends string> = {
    segments: SegmentedButtonSegment<K>[];
    /** Rótulo do grupo para o leitor de tela (ex.: "Mostrar agendamentos"). */
    accessibilityLabel: string;
};

export type SegmentedButtonProps<K extends string> = Comum<K> &
    (
        | { multiSelect?: false; selected: K; onSelect: (value: K) => void }
        | { multiSelect: true; selected: K[]; onSelect: (value: K) => void }
    );

/** Leva os 40 dp do segmento ao alvo de toque de 48 dp (06-acessibilidade.md). */
const folga = (componentSizes.touchTarget - componentSizes.segmentedButton.height) / 2;

export const SegmentedButton = <K extends string>(props: SegmentedButtonProps<K>) => {
    const { theme } = useDesignSystem();
    const { colors, spacing } = theme;
    const { segments, accessibilityLabel } = props;
    const escolhido = (v: K) => (props.multiSelect ? props.selected.includes(v) : props.selected === v);
    const icone = componentSizes.segmentedButton.icon;

    return (
        <View
            accessibilityRole={props.multiSelect ? undefined : "radiogroup"}
            accessibilityLabel={accessibilityLabel}
            style={{
                flexDirection: "row",
                height: componentSizes.segmentedButton.height,
                borderRadius: theme.shapes.full,
                borderWidth: 1,
                borderColor: colors.outline,
                overflow: "hidden",
            }}
        >
            {segments.map((s, i) => {
                const ativo = escolhido(s.value);
                const cor = s.disabled
                    ? withAlpha(colors.onSurface, theme.state.disabledContent)
                    : ativo
                      ? colors.onSecondaryContainer
                      : colors.onSurface;
                const camada = withAlpha(ativo ? colors.onSecondaryContainer : colors.onSurface, theme.state.pressed);
                return (
                    <Pressable
                        key={s.value}
                        onPress={() => {
                            // Na seleção única, tocar de novo no escolhido não faz nada.
                            if (!props.multiSelect && ativo) return;
                            props.onSelect(s.value);
                        }}
                        disabled={s.disabled}
                        hitSlop={{ top: folga, bottom: folga }}
                        accessibilityRole={props.multiSelect ? "checkbox" : "radio"}
                        accessibilityLabel={s.label}
                        accessibilityState={{ checked: ativo, disabled: Boolean(s.disabled) }}
                        android_ripple={{ color: camada }}
                        style={({ pressed }) => ({
                            flex: 1,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: spacing.sm,
                            paddingHorizontal: spacing.md,
                            borderLeftWidth: i > 0 ? 1 : 0,
                            borderLeftColor: s.disabled ? withAlpha(colors.onSurface, theme.state.disabledContainer) : colors.outline,
                            backgroundColor: ativo
                                ? Platform.OS === "ios" && pressed
                                    ? withAlpha(colors.secondaryContainer, 1 - theme.state.pressed)
                                    : colors.secondaryContainer
                                : Platform.OS === "ios" && pressed
                                  ? camada
                                  : "transparent",
                        })}
                    >
                        {ativo ? (
                            <Icon name="checkmark" size={icone} color={cor} />
                        ) : s.icon ? (
                            <Icon name={s.icon} size={icone} color={cor} />
                        ) : null}
                        <Typography variant="labelLarge" numberOfLines={1} style={{ color: cor, flexShrink: 1 }}>
                            {s.label}
                        </Typography>
                    </Pressable>
                );
            })}
        </View>
    );
};
