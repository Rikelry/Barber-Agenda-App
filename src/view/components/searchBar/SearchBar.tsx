// Barra de busca (design-system/04-componentes/barra-busca.md): contêiner arredondado com lupa,
// campo de texto e botão de limpar quando há texto.

import { Pressable, TextInput, View } from "react-native";

import { Icon } from "@/view/components/icon";
import { useDesignSystem } from "@/view/components/themeProvider";
import { componentSizes, getPlatformFontFamily } from "@/view/theme";

export type SearchBarProps = {
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    accessibilityLabel: string;
};

export const SearchBar = ({ value, onChangeText, placeholder, accessibilityLabel }: SearchBarProps) => {
    const { theme } = useDesignSystem();
    const { colors, typography, spacing } = theme;

    return (
        <View
            style={[
                {
                    flexDirection: "row",
                    alignItems: "center",
                    gap: spacing.sm,
                    minHeight: componentSizes.searchBar.height,
                    paddingHorizontal: spacing.lg,
                    borderRadius: theme.shapes.full,
                    backgroundColor: colors.surfaceContainerHigh,
                },
                theme.getElevationStyle("level1", colors.shadow),
            ]}
        >
            <Icon name="search" size={spacing.xl} color={colors.onSurfaceVariant} />
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={colors.onSurfaceVariant}
                accessibilityLabel={accessibilityLabel}
                accessibilityHint={placeholder}
                returnKeyType="search"
                autoCorrect={false}
                style={{
                    flex: 1,
                    minHeight: componentSizes.searchBar.height,
                    fontSize: typography.bodyLarge.fontSize,
                    lineHeight: typography.bodyLarge.lineHeight,
                    letterSpacing: typography.bodyLarge.letterSpacing,
                    fontFamily: getPlatformFontFamily(typography.bodyLarge.fontWeight),
                    color: colors.onSurface,
                }}
            />
            {value.length > 0 && (
                <Pressable
                    onPress={() => onChangeText("")}
                    accessibilityRole="button"
                    accessibilityLabel="Limpar busca"
                    hitSlop={spacing.md}
                    style={{
                        minWidth: componentSizes.touchTarget,
                        minHeight: componentSizes.touchTarget,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Icon name="close" size={spacing.xl} color={colors.onSurfaceVariant} />
                </Pressable>
            )}
        </View>
    );
};
