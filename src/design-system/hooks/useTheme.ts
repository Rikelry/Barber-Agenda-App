import { useDesignSystem } from "../providers/DesignSystemProvider";
import type { DesignTheme } from "../theme";

export function useTheme(): DesignTheme {
    const { theme } = useDesignSystem();
    return theme;
}
