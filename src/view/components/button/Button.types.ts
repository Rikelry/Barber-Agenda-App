import type {
    PressableProps,
    StyleProp,
    ViewStyle,
} from "react-native";

import type { ReactNode } from "react";
import type { TypographyVariant } from "@/view/theme";

export type ButtonVariant =
    | "filled"
    | "elevated"
    | "tonal"
    | "outlined"
    | "text";

export type ButtonSize =
    | "xs"
    | "small"
    | "medium"
    | "large"
    | "xl";

export type ButtonShape = "round" | "square";

export type ButtonProps = Omit<
    PressableProps,
    "children" | "style"
> & {
    children: ReactNode;

    variant?: ButtonVariant;

    size?: ButtonSize;

    shape?: ButtonShape;

    leadingIcon?: ReactNode | ((color: string) => ReactNode);

    trailingIcon?: ReactNode | ((color: string) => ReactNode);

    fullWidth?: boolean;

    typographyVariant?: TypographyVariant;

    style?: StyleProp<ViewStyle>;
};
