import type { StyleProp, ViewStyle } from "react-native";

export type SwitchProps = {
    value: boolean;
    onValueChange?: (value: boolean) => void;
    disabled?: boolean;
    style?: StyleProp<ViewStyle>;
};
