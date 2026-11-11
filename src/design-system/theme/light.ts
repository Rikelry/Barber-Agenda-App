import { lightColors } from "../tokens/colors";
import { spacing } from "../tokens/spacing";
import { shapes } from "../tokens/shapes";
import { typography } from "../tokens/typography";
import { motion } from "../tokens/motion";
import { elevation, getElevationStyle } from "../tokens/elevation";
import { stateTokens } from "../tokens/state";

import type { DesignTheme } from "./types";

export const lightTheme: DesignTheme = {
    mode: "light",
    colors: lightColors,
    spacing,
    shapes,
    typography,
    motion,
    elevation,
    getElevationStyle,
    state: stateTokens,
};
