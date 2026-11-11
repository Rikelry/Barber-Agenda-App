import { Platform, type Insets } from "react-native";

/**
 * Calculates hitSlop to guarantee accessibility compliance:
 * - Android (Material 3 / WCAG 2.5.5): 48×48dp
 * - iOS (Apple HIG): 44×44pt
 */
export function getHitSlop(
    width: number,
    height: number,
    minSize: number = Platform.OS === "ios" ? 44 : 48,
): Insets | undefined {
    const horizontalDiff = Math.max(0, minSize - width);
    const verticalDiff = Math.max(0, minSize - height);

    if (horizontalDiff === 0 && verticalDiff === 0) {
        return undefined;
    }

    const top = Math.ceil(verticalDiff / 2);
    const bottom = Math.floor(verticalDiff / 2);
    const left = Math.ceil(horizontalDiff / 2);
    const right = Math.floor(horizontalDiff / 2);

    return { top, bottom, left, right };
}
