/**
 * Material Design 3 State Layer Opacities
 * Ref: https://m3.material.io/foundations/interaction-states
 */
export const stateTokens = {
    hover: 0.08,
    focus: 0.10,
    pressed: 0.12,
    dragged: 0.16,
    disabledContainer: 0.12,
    disabledContent: 0.38,
} as const;

export type StateTokens = typeof stateTokens;
