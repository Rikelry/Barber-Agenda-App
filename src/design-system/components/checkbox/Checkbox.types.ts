import type { StyleProp, ViewStyle } from "react-native";

export type CheckboxProps = {
    checked: boolean;
    onCheckedChange?: (checked: boolean) => void;
    label?: string;
    disabled?: boolean;
    style?: StyleProp<ViewStyle>;
};
