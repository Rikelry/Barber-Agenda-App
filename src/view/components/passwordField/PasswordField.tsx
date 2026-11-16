// Campo de senha: TextField com o botão de olho para mostrar/esconder (estado só visual).

import { useState } from "react";

import { Icon } from "@/view/components/icon";
import { IconButton } from "@/view/components/iconButton";
import { TextField } from "@/view/components/textField";
import type { TextFieldProps } from "@/view/components/textField";

export type PasswordFieldProps = Omit<TextFieldProps, "secureTextEntry" | "trailingIcon"> & {
    /** Nome do campo no rótulo do botão (ex.: "Mostrar nova senha"). */
    fieldName?: string;
};

export const PasswordField = ({ fieldName = "senha", label, ...props }: PasswordFieldProps) => {
    const [visivel, setVisivel] = useState(false);
    return (
        <TextField
            {...props}
            label={label}
            secureTextEntry={!visivel}
            autoCapitalize="none"
            autoCorrect={false}
            trailingIcon={
                <IconButton
                    accessibilityLabel={visivel ? `Esconder ${fieldName}` : `Mostrar ${fieldName}`}
                    onPress={() => setVisivel((v) => !v)}
                    icon={(cor) => <Icon name={visivel ? "close" : "eye"} color={cor} />}
                />
            }
        />
    );
};
