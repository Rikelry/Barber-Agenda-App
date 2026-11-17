import type { StyleProp, ViewProps, ViewStyle, PressableProps } from "react-native";
import type { ReactNode } from "react";

export type CardVariant = "elevated" | "filled" | "outlined";

export type CardProps = Omit<ViewProps, "style"> & {
    children: ReactNode;
    variant?: CardVariant;
    onPress?: PressableProps["onPress"];
    disabled?: boolean;
    style?: StyleProp<ViewStyle>;
};
