// Confirmação de recusa (aba Trabalho): diálogo do Material 3 com o motivo opcional, que aparece
// para o cliente.

import { Button } from "@/view/components/button";
import { useDesignSystem } from "@/view/components/themeProvider";
import { Dialog } from "@/view/components/dialog";
import { TextField } from "@/view/components/textField";
import { Typography } from "@/view/components/typography";

export type RejectDialogProps = {
    clientName: string | null;
    reason: string;
    error: string | null;
    busy: boolean;
    onChangeReason: (reason: string) => void;
    onDismiss: () => void;
    onConfirm: () => void;
};

export const RejectDialog = ({ clientName, reason, error, busy, onChangeReason, onDismiss, onConfirm }: RejectDialogProps) => {
    const { theme } = useDesignSystem();
    return (
        <Dialog
            visible={clientName !== null}
            title="Recusar pedido?"
            supportingText={`${clientName ?? ""} vai ver o pedido como recusado e o horário fica livre.`}
            onDismiss={onDismiss}
            actions={
                <>
                    <Button variant="text" size="small" onPress={onDismiss} disabled={busy}>
                        Voltar
                    </Button>
                    <Button variant="text" size="small" onPress={onConfirm} disabled={busy} accessibilityLabel="Confirmar recusa">
                        <Typography variant="labelLarge" color="error">
                            {busy ? "Recusando..." : "Recusar"}
                        </Typography>
                    </Button>
                </>
            }
        >
            <TextField
                floatingLabel
                label="Motivo (opcional)"
                placeholder="Ex.: não atendo nesse horário"
                value={reason}
                onChangeText={onChangeReason}
                maxLength={200}
                multiline
                errorText={error ?? undefined}
                labelBackgroundColor={theme.colors.surfaceContainerHigh}
            />
        </Dialog>
    );
};
