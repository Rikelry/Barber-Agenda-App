import { useTheme } from "./useTheme";
import type { ColorTokens } from "../tokens/colors";

export function useColors(): ColorTokens {
    const theme = useTheme();
    return theme.colors;
}
