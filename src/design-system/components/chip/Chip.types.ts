import type { StyleProp, ViewStyle, PressableProps } from "react-native";
import type { ReactNode } from "react";

export type ChipVariant = "assist" | "filter" | "input" | "suggestion";

export type ChipProps = Omit<
    PressableProps,
    "children" | "style" | "accessibilityRole" | "accessibilityState"
> & {
    label: string;
    variant?: ChipVariant;
    selected?: boolean;
    disabled?: boolean;
    leadingIcon?: ReactNode | ((color: string) => ReactNode);
    trailingIcon?: ReactNode | ((color: string) => ReactNode);
    onClose?: () => void;
    style?: StyleProp<ViewStyle>;
};
