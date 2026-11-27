// Campos da barbearia (nome, telefone e endereço em partes), usados em Nova e Editar. Duas
// seções do Material 3, INFORMAÇÕES GERAIS e ENDEREÇO, com outlined text fields de rótulo
// flutuante; Número fica ao lado do Complemento (ou do Bairro, na Nova).

import type { ComponentProps, ReactNode } from "react";
import { View } from "react-native";

import { TextField } from "@/view/components/textField";
import { useDesignSystem } from "@/view/components/themeProvider";
import { Typography } from "@/view/components/typography";

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
    const { spacing } = theme;
    const campo = (
        field: keyof BarbershopFieldsValues,
        label: string,
        placeholder: string,
        extra: Partial<ComponentProps<typeof TextField>> = {},
    ) => (
        <TextField
            floatingLabel
            label={label}
            placeholder={placeholder}
            value={values[field]}
            onChangeText={(t) => onChange(field, t)}
            errorText={errors[field]}
            {...extra}
        />
    );

    const secao = (titulo: string) => (
        <Typography
            variant="labelLarge"
            weight="700"
            color="secondary"
            accessibilityRole="header"
            style={{ letterSpacing: 0.8, paddingTop: spacing.sm }}
        >
            {titulo}
        </Typography>
    );

    // Dois campos lado a lado, alinhados pelo topo (o erro de um não desalinha o outro).
    const lado = (esquerda: ReactNode, direita: ReactNode, proporcao: [number, number]) => (
        <View style={{ flexDirection: "row", alignItems: "flex-start", gap: spacing.md }}>
            <View style={{ flex: proporcao[0] }}>{esquerda}</View>
            <View style={{ flex: proporcao[1] }}>{direita}</View>
        </View>
    );

    return (
        <View style={{ gap: spacing.lg }}>
            {secao("INFORMAÇÕES GERAIS")}
            {campo("name", "Nome da barbearia", "Ex: Barbearia do Lucas")}
            {campo("phone", "Telefone comercial", "Ex: (11) 98765-4321", { keyboardType: "phone-pad" })}

            {secao("ENDEREÇO")}
            {campo("cep", "CEP", "Ex: 01311-000", { keyboardType: "number-pad" })}
            {campo("street", "Rua", "Ex: Av. Paulista")}
            {full
                ? lado(
                      campo("number", "Número", "Ex: 1000", { keyboardType: "number-pad" }),
                      campo("complement", "Complemento", "Ex: Sala 402"),
                      [1, 2],
                  )
                : lado(
                      campo("number", "Número", "Ex: 1000", { keyboardType: "number-pad" }),
                      campo("neighborhood", "Bairro", "Ex: Bela Vista"),
                      [1, 2],
                  )}
            {full ? campo("neighborhood", "Bairro", "Ex: Bela Vista") : null}
            {full
                ? lado(
                      campo("city", "Cidade", "Ex: São Paulo"),
                      campo("state", "Estado", "SP", { autoCapitalize: "characters", maxLength: 2 }),
                      [2, 1],
                  )
                : null}
        </View>
    );
};
