/**
 * Material Design 3 & Material Design 3 Expressive Motion Tokens
 * Ref: https://m3.material.io/styles/motion/easing-and-duration/tokens-specs
 */
export const motion = {
    duration: {
        short1: 50,
        short2: 100,
        short3: 150,
        short4: 200,

        medium1: 250,
        medium2: 300,
        medium3: 350,
        medium4: 400,

        long1: 450,
        long2: 500,
        long3: 550,
        long4: 600,

        extraLong1: 700,
        extraLong2: 800,
        extraLong3: 900,
        extraLong4: 1000,
    },

    easing: {
        standard: [0.2, 0, 0, 1] as const,
        standardAccelerate: [0.3, 0, 1, 1] as const,
        standardDecelerate: [0, 0, 0, 1] as const,
        emphasized: [0.2, 0, 0, 1] as const,
        emphasizedAccelerate: [0.3, 0, 0.8, 0.15] as const,
        emphasizedDecelerate: [0.05, 0.7, 0.1, 1] as const,
    },

    /**
     * M3 Expressive Physics-Based Spring Presets (for React Native Reanimated withSpring)
     */
    spring: {
        expressive: {
            damping: 14,
            stiffness: 180,
            mass: 1,
        },
        snappy: {
            damping: 20,
            stiffness: 300,
            mass: 0.8,
        },
        bouncy: {
            damping: 10,
            stiffness: 160,
            mass: 1,
        },
        gentle: {
            damping: 24,
            stiffness: 140,
            mass: 1,
        },
    },
} as const;

export type MotionTokens = typeof motion;
