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

    /**
     * Rótulo do Material 3 dentro do contorno, que sobe para a borda ao focar ou preencher
     * (campo-de-texto.md). Padrão: rótulo fixo acima do campo.
     */
    floatingLabel?: boolean;
    /** Fundo atrás do rótulo flutuante quando o campo não fica sobre o fundo da tela (ex.: num diálogo). */
    labelBackgroundColor?: string;

    leadingIcon?: ReactNode | ((color: string) => ReactNode);
    trailingIcon?: ReactNode | ((color: string) => ReactNode);

    disabled?: boolean;

    containerStyle?: StyleProp<ViewStyle>;
    inputStyle?: StyleProp<TextStyle>;
};
