import { Text } from "react-native";
import { useDesignSystem } from "@/view/components/themeProvider";
import { getTypographyStyle } from "@/view/components/typography/Typography.styles";
import type { TypographyProps } from "@/view/components/typography/Typography.types";

export const Typography = ({
  children,
  variant = "bodyMedium",
  color = "onSurface",
  align,
  weight,
  style,
  maxFontSizeMultiplier = 2,
  ...textProps
}: TypographyProps) => {
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
