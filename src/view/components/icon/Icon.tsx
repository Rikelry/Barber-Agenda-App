// Ícone do app: Material Symbols (Outlined) no Android e na web, como no canvas de telas,
// e o SF Symbol equivalente no iOS. Usa o expo-symbols, que já vem no projeto.

import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { View } from "react-native";

import { useDesignSystem } from "@/view/components/themeProvider";
import type { IconProps } from "@/view/components/icon/Icon.types";

type NomePorPlataforma = Exclude<SymbolViewProps["name"], string>;
type Simbolo = { material: NonNullable<NomePorPlataforma["android"]>; ios: NonNullable<NomePorPlataforma["ios"]> };

/** Nomes usados nas telas → símbolo de cada plataforma. */
const SIMBOLOS: Record<string, Simbolo> = {
    home: { material: "home", ios: "house" },
    search: { material: "search", ios: "magnifyingglass" },
    calendar: { material: "calendar_month", ios: "calendar" },
    clock: { material: "schedule", ios: "clock" },
    person: { material: "person", ios: "person" },
    scissors: { material: "content_cut", ios: "scissors" },
    chevronRight: { material: "chevron_right", ios: "chevron.right" },
    chevronLeft: { material: "chevron_left", ios: "chevron.left" },
    back: { material: "arrow_back", ios: "arrow.left" },
    plus: { material: "add", ios: "plus" },
    close: { material: "close", ios: "xmark" },
    trash: { material: "delete", ios: "trash" },
    lock: { material: "lock", ios: "lock" },
    edit: { material: "edit", ios: "pencil" },
    upload: { material: "add_a_photo", ios: "camera" },
    moreVert: { material: "more_vert", ios: "ellipsis" },
    eye: { material: "visibility", ios: "eye" },
    eyeOff: { material: "visibility_off", ios: "eye.slash" },
    gear: { material: "settings", ios: "gearshape" },
    store: { material: "storefront", ios: "storefront" },
    star: { material: "star", ios: "star.fill" },
    checkmark: { material: "check", ios: "checkmark" },
    location: { material: "location_on", ios: "mappin.and.ellipse" },
    phone: { material: "call", ios: "phone" },
    bell: { material: "notifications", ios: "bell" },
    logout: { material: "logout", ios: "rectangle.portrait.and.arrow.right" },
    blocked: { material: "event_busy", ios: "calendar.badge.minus" },
    error: { material: "error", ios: "exclamationmark.circle" },
    badge: { material: "badge", ios: "person.text.rectangle" },
    camera: { material: "photo_camera", ios: "camera" },
    photos: { material: "photo_library", ios: "photo.on.rectangle" },
    // Setas e selo dos cards do Início.
    arrowForward: { material: "arrow_forward", ios: "arrow.right" },
    checkCircle: { material: "check_circle", ios: "checkmark.circle.fill" },
    group: { material: "group", ios: "person.2" },
    // Aba Trabalho: seletor de barbearia, iniciar, não compareceu e motivo.
    expandMore: { material: "expand_more", ios: "chevron.down" },
    play: { material: "play_arrow", ios: "play.fill" },
    personOff: { material: "person_off", ios: "person.slash" },
    taskAlt: { material: "task_alt", ios: "checkmark.circle" },
    notes: { material: "notes", ios: "text.alignleft" },
};

export const Icon = ({ name, size = 24, color, style, children }: IconProps) => {
    const { theme } = useDesignSystem();
    const cor = color ?? theme.colors.onSurface;
    const caixa = [{ width: size, height: size, alignItems: "center" as const, justifyContent: "center" as const }, style];

    if (children) return <View style={caixa}>{children}</View>;

    const simbolo = name ? SIMBOLOS[name] : undefined;
    return (
        <View style={caixa} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
            {simbolo ? (
                <SymbolView
                    name={{ ios: simbolo.ios, android: simbolo.material, web: simbolo.material }}
                    size={size}
                    tintColor={cor}
                    type="monochrome"
                />
            ) : null}
        </View>
    );
};
