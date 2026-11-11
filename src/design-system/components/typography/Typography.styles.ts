import type { TextStyle } from "react-native";
import type { DesignTheme } from "../../theme/types";
import { getPlatformFontFamily, type TypographyVariant } from "../../tokens/typography";
import type { TypographyColor } from "./Typography.types";

export type TypographyStyleOptions = {
    theme: DesignTheme;
    variant: TypographyVariant;
    color: TypographyColor;
    align?: TextStyle["textAlign"];
    weight?: TextStyle["fontWeight"];
};

export function getTypographyStyle({
    theme,
    variant,
    color,
    align,
    weight,
}: TypographyStyleOptions): TextStyle {
    const token = theme.typography[variant];
    const resolvedWeight = weight ?? token.fontWeight;
    const resolvedColor =
        color in theme.colors
            ? theme.colors[color as keyof typeof theme.colors]
            : color;

    return {
        fontSize: token.fontSize,
        lineHeight: token.lineHeight,
        letterSpacing: token.letterSpacing,
        fontWeight: resolvedWeight,
        fontFamily: getPlatformFontFamily(resolvedWeight),
        color: resolvedColor,
        textAlign: align,
    };
}
