import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useDesignSystem } from "../../providers/DesignSystemProvider";
import { Icon } from "../icon";
import { Typography } from "../typography";

import type { TabBarProps } from "./TabBar.types";

/** tab-bar.md: 4 seções, indicador de fundo na ativa e alvo de toque de 48 dp. */
const MIN_TOUCH = 48;
const INDICATOR = { width: 56, height: 32 };

export function TabBar({ items, style }: TabBarProps) {
    const { theme } = useDesignSystem();
    const { colors, spacing } = theme;
    const insets = useSafeAreaInsets();

    return (
        <View
            accessibilityRole="tablist"
            style={[
                {
                    flexDirection: "row",
                    backgroundColor: colors.surfaceContainer,
                    paddingTop: spacing.md,
                    paddingBottom: Math.max(insets.bottom, spacing.md),
                },
                style,
            ]}
        >
            {items.map((item) => {
                const selected = Boolean(item.selected);
                const color = selected ? colors.onSecondaryContainer : colors.onSurfaceVariant;
                return (
                    <Pressable
                        key={item.key}
                        accessibilityRole="tab"
                        accessibilityLabel={item.label}
                        accessibilityState={{ selected, disabled: Boolean(item.disabled) }}
                        disabled={item.disabled || selected}
                        onPress={item.onPress}
                        style={{
                            flex: 1,
                            minWidth: MIN_TOUCH,
                            minHeight: MIN_TOUCH,
                            alignItems: "center",
                            gap: spacing.xs,
                            opacity: item.disabled ? theme.state.disabledContent : 1,
                        }}
                    >
                        <View
                            style={{
                                width: INDICATOR.width,
                                height: INDICATOR.height,
                                borderRadius: theme.shapes.full,
                                backgroundColor: selected ? colors.secondaryContainer : "transparent",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Icon name={item.icon} size={spacing.xxl} color={color} />
                        </View>
                        <Typography
                            variant="labelMedium"
                            weight={selected ? "700" : "500"}
                            style={{ color: selected ? colors.onSurface : colors.onSurfaceVariant }}
                        >
                            {item.label}
                        </Typography>
                    </Pressable>
                );
            })}
        </View>
    );
}
