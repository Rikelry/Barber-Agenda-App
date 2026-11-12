import type {
    StyleProp,
    TextInputProps,
    TextStyle,
    ViewStyle,
} from "react-native";
import type { ReactNode } from "react";

export type TextFieldVariant = "outlined" | "filled";

export type TextFieldProps = Omit<TextInputProps, "style"> & {
    label?: string;
    supportingText?: string;
    errorText?: string;

    variant?: TextFieldVariant;

    leadingIcon?: ReactNode | ((color: string) => ReactNode);
    trailingIcon?: ReactNode | ((color: string) => ReactNode);

    disabled?: boolean;
    labelAlwaysFloating?: boolean;

    containerStyle?: StyleProp<ViewStyle>;
    inputStyle?: StyleProp<TextStyle>;
};
