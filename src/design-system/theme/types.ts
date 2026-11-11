import type { ColorTokens } from "../tokens/colors";
import type { SpacingTokens } from "../tokens/spacing";
import type { ShapeTokens } from "../tokens/shapes";
import type { TypographyTokens } from "../tokens/typography";
import type { MotionTokens } from "../tokens/motion";
import type { elevation, getElevationStyle } from "../tokens/elevation";
import type { StateTokens } from "../tokens/state";

export type ThemeMode = "light" | "dark";

export type DesignTheme = {
    mode: ThemeMode;
    colors: ColorTokens;
    spacing: SpacingTokens;
    shapes: ShapeTokens;
    typography: TypographyTokens;
    motion: MotionTokens;
    elevation: typeof elevation;
    getElevationStyle: typeof getElevationStyle;
    state: StateTokens;
};
