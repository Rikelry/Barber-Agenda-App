import type { PressableProps, StyleProp, ViewStyle } from "react-native";
import type { ReactNode } from "react";

export type FABVariant = "primary" | "surface" | "secondary" | "tertiary";
export type FABSize = "small" | "medium" | "large";

export type FABProps = Omit<
    PressableProps,
    "children" | "style" | "accessibilityRole" | "accessibilityState"
> & {
    icon: (color: string) => ReactNode;
    accessibilityLabel: string;
    variant?: FABVariant;
    size?: FABSize;
    disabled?: boolean;
    style?: StyleProp<ViewStyle>;
};

export type ExtendedFABProps = Omit<
    PressableProps,
    "children" | "style" | "accessibilityRole" | "accessibilityState"
> & {
    label: string;
    icon?: (color: string) => ReactNode;
    variant?: FABVariant;
    disabled?: boolean;
    style?: StyleProp<ViewStyle>;
};
