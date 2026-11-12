export type AvatarSize = "small" | "medium" | "large";

export type AvatarProps = {
    /** Nome da pessoa: vira o rótulo do leitor de tela e a inicial do placeholder. */
    name: string;
    uri?: string | null;
    size?: AvatarSize;
    /** Anel na cor primária em volta da foto (perfil). */
    outlined?: boolean;
};
