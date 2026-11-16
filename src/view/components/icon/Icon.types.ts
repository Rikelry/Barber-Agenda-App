import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import type { ReactNode } from "react";

export type IconProps = {
    name?: string;
    size?: number;
    color?: string;
    style?: StyleProp<ViewStyle | TextStyle>;
    children?: ReactNode;
};
