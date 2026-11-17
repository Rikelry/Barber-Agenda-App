import type { StyleProp, ViewStyle } from "react-native";

export type TabBarItem = {
    key: string;
    label: string;
    /** Nome do ícone do componente Icon (ou o próprio símbolo). */
    icon: string;
    selected?: boolean;
    disabled?: boolean;
    onPress?: () => void;
};

export type TabBarProps = {
    items: TabBarItem[];
    style?: StyleProp<ViewStyle>;
};
