/**
 * Utility functions for robust color transformations
 */

/**
 * Converts a hex or rgba string to an rgba string with specified opacity.
 * Supports 3-digit hex (#FFF), 6-digit hex (#FFFFFF), 8-digit hex (#FFFFFFFF),
 * existing rgba/rgb strings, and named colors ('transparent').
 */
export function hexToRgba(color: string, opacity: number): string {
    if (!color) {
        return `rgba(0, 0, 0, ${opacity})`;
    }

    if (color === "transparent") {
        return "transparent";
    }

    const trimmed = color.trim();

    // RGB / RGBA string
    if (trimmed.startsWith("rgb")) {
        const parts = trimmed
            .replace(/rgba?\(|\)/g, "")
            .split(",")
            .map((p) => p.trim());
        const r = parseInt(parts[0] ?? "0", 10);
        const g = parseInt(parts[1] ?? "0", 10);
        const b = parseInt(parts[2] ?? "0", 10);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }

    // Hex string
    const hex = trimmed.replace("#", "");

    let r = 0;
    let g = 0;
    let b = 0;

    if (hex.length === 3) {
        r = parseInt((hex[0] ?? "0") + (hex[0] ?? "0"), 16);
        g = parseInt((hex[1] ?? "0") + (hex[1] ?? "0"), 16);
        b = parseInt((hex[2] ?? "0") + (hex[2] ?? "0"), 16);
    } else if (hex.length >= 6) {
        r = parseInt(hex.slice(0, 2), 16);
        g = parseInt(hex.slice(2, 4), 16);
        b = parseInt(hex.slice(4, 6), 16);
    } else {
        return `rgba(0, 0, 0, ${opacity})`;
    }

    if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) {
        return `rgba(0, 0, 0, ${opacity})`;
    }

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export const withAlpha = hexToRgba;
