// Campos da barbearia (nome, telefone e endereço em partes), usados em Nova e Editar.

import { View } from "react-native";

import { TextField } from "@/view/components/textField";
import { useDesignSystem } from "@/view/components/themeProvider";

export type BarbershopFieldsValues = {
    name: string;
    phone: string;
    cep: string;
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
};

export type BarbershopFieldsProps = {
    values: BarbershopFieldsValues;
    errors: Partial<Record<keyof BarbershopFieldsValues, string>>;
    onChange: (field: keyof BarbershopFieldsValues, value: string) => void;
    /** Editar mostra complemento, cidade e estado; Nova só o essencial. */
    full?: boolean;
};

export const BarbershopFields = ({ values, errors, onChange, full = false }: BarbershopFieldsProps) => {
    const { theme } = useDesignSystem();
    const campo = (
        field: keyof BarbershopFieldsValues,
        label: string,
        placeholder: string,
        extra: Partial<React.ComponentProps<typeof TextField>> = {},
    ) => (
        <TextField
            label={label}
            placeholder={placeholder}
            labelAlwaysFloating
            value={values[field]}
            onChangeText={(t) => onChange(field, t)}
            errorText={errors[field]}
            {...extra}
        />
    );

    return (
        <>
            {campo("name", "Nome da barbearia", "Ex: Barbearia do Lucas")}
            {campo("phone", "Telefone comercial", "Ex: (11) 98765-4321", { keyboardType: "phone-pad" })}
            {campo("cep", "CEP", "Ex: 01311-000", { keyboardType: "number-pad" })}
            {campo("street", "Rua", "Ex: Av. Paulista")}
            {campo("number", "Número", "Ex: 1000", { keyboardType: "number-pad" })}
            {full ? campo("complement", "Complemento", "Ex: Sala 402") : null}
            {campo("neighborhood", "Bairro", "Ex: Bela Vista")}
            {full ? (
                <View style={{ flexDirection: "row", gap: theme.spacing.md }}>
                    <View style={{ flex: 2 }}>{campo("city", "Cidade", "Ex: São Paulo")}</View>
                    <View style={{ flex: 1 }}>{campo("state", "Estado", "SP", { autoCapitalize: "characters", maxLength: 2 })}</View>
                </View>
            ) : null}
        </>
    );
};
