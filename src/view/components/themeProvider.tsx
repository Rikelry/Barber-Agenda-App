import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
    type PropsWithChildren,
} from "react";

import { useColorScheme } from "react-native";

import { darkTheme, lightTheme } from "@/view/theme";

import type { DesignTheme, ThemeMode } from "@/view/theme";

export type ThemePreference = ThemeMode | "system";

export type DesignSystemContextValue = {
    theme: DesignTheme;
    mode: ThemeMode;
    preference: ThemePreference;
    setPreference: (preference: ThemePreference) => void;
    toggleTheme: () => void;
};

const DesignSystemContext =
    createContext<DesignSystemContextValue | null>(null);

export type DesignSystemProviderProps = PropsWithChildren<{
    mode?: ThemePreference;
}>;

export const DesignSystemProvider = ({
    children,
    mode: initialPreference = "system",
}: DesignSystemProviderProps) => {
    const [preference, setPreference] = useState<ThemePreference>(initialPreference);
    const systemColorScheme = useColorScheme();

    const resolvedMode: ThemeMode =
        preference === "system"
            ? systemColorScheme === "dark"
                ? "dark"
                : "light"
            : preference;

    const theme = resolvedMode === "dark"
        ? darkTheme
        : lightTheme;

    const toggleTheme = useCallback(() => {
        setPreference((prev) => {
            const currentEffective =
                prev === "system"
                    ? systemColorScheme === "dark"
                        ? "dark"
                        : "light"
                    : prev;
            return currentEffective === "dark" ? "light" : "dark";
        });
    }, [systemColorScheme]);

    const value = useMemo(
        () => ({
            theme,
            mode: resolvedMode,
            preference,
            setPreference,
            toggleTheme,
        }),
        [theme, resolvedMode, preference, toggleTheme],
    );

    return (
        <DesignSystemContext.Provider value={value}>
            {children}
        </DesignSystemContext.Provider>
    );
}

export function useDesignSystem() {
    const context = useContext(DesignSystemContext);

    if (!context) {
        throw new Error(
            "useDesignSystem must be used inside DesignSystemProvider",
        );
    }

    return context;
}

export function useTheme(): DesignTheme {
    const { theme } = useDesignSystem();
    return theme;
}

export function useColors(): DesignTheme["colors"] {
    return useTheme().colors;
}
