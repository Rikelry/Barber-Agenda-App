import type { StyleProp, ViewStyle } from "react-native";

export type DividerOrientation = "horizontal" | "vertical";

export type DividerProps = {
    orientation?: DividerOrientation;
    inset?: boolean;
    insetStart?: number;
    insetEnd?: number;
    color?: string;
    style?: StyleProp<ViewStyle>;
};
