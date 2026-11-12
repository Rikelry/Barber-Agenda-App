// Formatação de valores para exibição (pt-BR).

export const formatPrice = (value: number): string =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const formatDuration = (minutes: number): string => {
    const h = Math.floor(minutes / 60);
    const m = Math.round(minutes % 60);
    if (h === 0) return `${m} min`;
    return m === 0 ? `${h}h` : `${h}h ${m}min`;
};

/** 86999990000 → (86) 99999-0000. Outros formatos voltam como vieram. */
export const formatPhone = (phone: string): string => {
    const d = phone.replace(/\D/g, "");
    if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
    if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    return phone;
};
