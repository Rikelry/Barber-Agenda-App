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
    /** Fundo do rótulo flutuante no variant outlined; use a cor da superfície onde o campo está. */
    labelBackgroundColor?: string;

    containerStyle?: StyleProp<ViewStyle>;
    inputStyle?: StyleProp<TextStyle>;
};
