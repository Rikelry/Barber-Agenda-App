import { Text } from "react-native";
import { useDesignSystem } from "../../providers/DesignSystemProvider";
import { getTypographyStyle } from "./Typography.styles";
import type { TypographyProps } from "./Typography.types";

export function Typography({
  children,
  variant = "bodyMedium",
  color = "onSurface",
  align,
  weight,
  style,
  maxFontSizeMultiplier = 2,
  ...textProps
}: TypographyProps) {
  const { theme } = useDesignSystem();

  const typographyStyle = getTypographyStyle({
    theme,
    variant,
    color,
    align,
    weight,
  });

  return (
    <Text
      {...textProps}
      maxFontSizeMultiplier={maxFontSizeMultiplier}
      style={[typographyStyle, style]}
    >
      {children}
    </Text>
  );
}
