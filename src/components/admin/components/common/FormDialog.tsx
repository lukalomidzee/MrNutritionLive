import {Button, Dialog, DialogActions, DialogContent, DialogTitle,} from "@mui/material";
import {ReactNode} from "react";

export default function FormDialog(props: Readonly<{
    open: boolean;
    title: string;
    children: ReactNode;
    onClose: () => void;
    onSubmit: () => void;
    submitLabel?: string;
    disabled?: boolean;
}>) {
    const {
        open,
        title,
        children,
        onClose,
        onSubmit,
        submitLabel = "Save",
        disabled,
    } = props;
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    if (!disabled) onSubmit();
                }}
            >
                <DialogTitle>{title}</DialogTitle>
                <DialogContent dividers>{children}</DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="inherit" type="button">
                        Cancel
                    </Button>
                    <Button
                        onClick={onSubmit}
                        type="submit"
                        variant="contained"
                        disabled={disabled}
                    >
                        {submitLabel}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
