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

const MESES_CURTOS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
const DIAS_CURTOS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

/** "Hoje, 16 Nov", "Amanhã, 17 Nov", "Seg, 23 Nov" ou "Ontem, 15 Nov". */
export const formatDayLabel = (date: Date, now: Date = new Date()): string => {
    const inicio = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    const dias = Math.round((inicio(date) - inicio(now)) / 86400000);
    const dia = dias === 0 ? "Hoje" : dias === 1 ? "Amanhã" : dias === -1 ? "Ontem" : DIAS_CURTOS[date.getDay()];
    return `${dia}, ${date.getDate()} ${MESES_CURTOS[date.getMonth()]}`;
};

/** 15:00 */
export const formatTime = (date: Date): string =>
    `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
