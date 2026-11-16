import type {
    PressableProps,
    StyleProp,
    ViewStyle,
} from "react-native";
import type { ReactNode } from "react";

export type IconButtonVariant =
    | "standard"
    | "filled"
    | "tonal"
    | "outlined";

export type IconButtonSize =
    | "xs"
    | "small"
    | "medium"
    | "large"
    | "xl";

export type IconButtonShape = "round" | "square";

export type IconButtonProps = Omit<
    PressableProps,
    | "children"
    | "style"
    | "accessibilityRole"
    | "accessibilityState"
> & {
    icon: (color: string) => ReactNode;
    accessibilityLabel: string;
    variant?: IconButtonVariant;
    size?: IconButtonSize;
    shape?: IconButtonShape;
    selected?: boolean;
    style?: StyleProp<ViewStyle>;
};
