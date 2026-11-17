import { StyleSheet, View } from "react-native";
import { useDesignSystem } from "@/view/components/themeProvider";
import type { DividerProps } from "@/view/components/divider/Divider.types";

export const Divider = ({
    orientation = "horizontal",
    inset = false,
    insetStart,
    insetEnd,
    color,
    style,
}: DividerProps) => {
    const { theme } = useDesignSystem();
    const resolvedColor = color ?? theme.colors.outlineVariant;

    const isHorizontal = orientation === "horizontal";

    return (
        <View
            style={[
                isHorizontal
                    ? {
                        height: StyleSheet.hairlineWidth,
                        width: "100%",
                        backgroundColor: resolvedColor,
                        marginLeft: insetStart ?? (inset ? theme.spacing.lg : 0),
                        marginRight: insetEnd ?? (inset ? theme.spacing.lg : 0),
                    }
                    : {
                        width: StyleSheet.hairlineWidth,
                        height: "100%",
                        backgroundColor: resolvedColor,
                        marginTop: insetStart ?? (inset ? theme.spacing.lg : 0),
                        marginBottom: insetEnd ?? (inset ? theme.spacing.lg : 0),
                    },
                style,
            ]}
        />
    );
}
