import { darkColors } from "../tokens/colors";
import { spacing } from "../tokens/spacing";
import { shapes } from "../tokens/shapes";
import { typography } from "../tokens/typography";
import { motion } from "../tokens/motion";
import { elevation, getElevationStyle } from "../tokens/elevation";
import { stateTokens } from "../tokens/state";

import type { DesignTheme } from "./types";

export const darkTheme: DesignTheme = {
    mode: "dark",
    colors: darkColors,
    spacing,
    shapes,
    typography,
    motion,
    elevation,
    getElevationStyle,
    state: stateTokens,
};
