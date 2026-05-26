import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography,} from "@mui/material";

export default function ConfirmDialog({
                                          open,
                                          title,
                                          message,
                                          confirmText = "Delete",
                                          confirmColor = "error",
                                          error,
                                          onCancel,
                                          onConfirm,
                                          loading = false,
                                      }: Readonly<{
    open: boolean;
    title: string;
    message?: string;
    confirmText?: string;
    confirmColor?:
        | "primary"
        | "secondary"
        | "error"
        | "warning"
        | "info"
        | "success";
    error?: string;
    onCancel: () => void;
    onConfirm: () => Promise<void> | void;
    loading?: boolean;
}>) {
    return (
        <Dialog open={open} onClose={loading ? undefined : onCancel}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                {message}
                {error && (
                    <Typography color="error" sx={{mt: 2}}>
                        {error}
                    </Typography>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel} disabled={loading}>
                    Cancel
                </Button>
                <Button
                    onClick={onConfirm}
                    variant="contained"
                    color={confirmColor}
                    disabled={loading}
                >
                    {confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
