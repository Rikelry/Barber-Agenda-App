import type {
  TextProps,
  TextStyle,
  StyleProp,
} from "react-native";

import type { TypographyVariant } from "../../tokens/typography";
import type { DesignTheme } from "../../theme/types";

export type TypographyColor = keyof DesignTheme["colors"] | (string & {});

export type TypographyProps = Omit<
  TextProps,
  "children" | "style"
> & {
  children?: React.ReactNode;
  variant?: TypographyVariant;
  color?: TypographyColor;
  align?: TextStyle["textAlign"];
  weight?: TextStyle["fontWeight"];
  style?: StyleProp<TextStyle>;
};
