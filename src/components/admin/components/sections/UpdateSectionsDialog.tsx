import {Stack, TextField} from "@mui/material";
import FormDialog from "../common/FormDialog";
import {ErrorText} from "../common/ErrorText";
import {useDetailsOnOpen} from "../../hooks/useDetailsOnOpen";
import {api} from "../../api/adminApi";

interface UpdateSectionDTO {
    sectionId: string;
    version?: number;
    order?: number;
    heading: string;
    headingGeo: string;
    paragraph: string;
    paragraphGeo: string;
    mediaAssetId?: string;
}

const DEFAULTS: Partial<UpdateSectionDTO> = {
    order: undefined,
    heading: "",
    headingGeo: "",
    paragraph: "",
    paragraphGeo: "",
    mediaAssetId: undefined,
};

export default function UpdateSectionDialog({
                                                open,
                                                courseId,
                                                sectionId,
                                                onClose,
                                                onSaved,
                                            }: Readonly<{
    open: boolean;
    courseId: string | null;
    sectionId: string | null;
    onClose: () => void;
    onSaved: () => void;
}>) {
    const map = (d: any): UpdateSectionDTO => ({
        sectionId: d.id ?? d.Id,
        version: d.version ?? d.Version ?? undefined,
        order: d.order ?? d.Order ?? undefined,
        heading: d.heading ?? d.Heading ?? "",
        headingGeo: d.headingGeo ?? d.HeadingGeo ?? "",
        paragraph: d.paragraph ?? d.Paragraph ?? "",
        paragraphGeo: d.paragraphGeo ?? d.ParagraphGeo ?? "",
        mediaAssetId: d.mediaAssetId ?? d.MediaAssetId ?? undefined,
    });

    const {
        model: m,
        setModel: setM,
        error,
    } = useDetailsOnOpen<UpdateSectionDTO>({
        open,
        id: sectionId,
        url: (id) => `/api/courses/${courseId}/sections/${id}`,
        map,
        defaults: DEFAULTS,
    });

    const set = <K extends keyof UpdateSectionDTO>(
        k: K,
        v: UpdateSectionDTO[K]
    ) => setM((s) => (s ? {...s, [k]: v} : s));

    const submit = async () => {
        if (!m || !courseId) return;
        await api.put(`/api/courses/${courseId}/sections/${m.sectionId}`, {
            order: m.order ?? undefined,
            heading: m.heading,
            headingGeo: m.headingGeo,
            paragraph: m.paragraph,
            paragraphGeo: m.paragraphGeo,
            mediaAssetId: m.mediaAssetId ?? undefined,
            version: m.version ?? 0,
        });
        onClose();
        onSaved();
    };

    return (
        <FormDialog
            open={open}
            title="Edit section"
            onClose={onClose}
            onSubmit={submit}
            disabled={!m}
        >
            {!m ? (
                "Loading…"
            ) : (
                <Stack spacing={2}>
                    <TextField
                        label="Order"
                        type="number"
                        value={m.order ?? ""}
                        onChange={(e) =>
                            set(
                                "order",
                                e.target.value === ""
                                    ? undefined
                                    : Number(e.target.value)
                            )
                        }
                        fullWidth
                    />
                    <TextField
                        label="Heading"
                        value={m.heading ?? ""}
                        onChange={(e) => set("heading", e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="Heading (Geo)"
                        value={m.headingGeo ?? ""}
                        onChange={(e) => set("headingGeo", e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="Paragraph"
                        value={m.paragraph ?? ""}
                        onChange={(e) => set("paragraph", e.target.value)}
                        multiline
                        minRows={3}
                        fullWidth
                    />
                    <TextField
                        label="Paragraph (Geo)"
                        value={m.paragraphGeo ?? ""}
                        onChange={(e) => set("paragraphGeo", e.target.value)}
                        multiline
                        minRows={3}
                        fullWidth
                    />
                    <ErrorText text={error}/>
                </Stack>
            )}
        </FormDialog>
    );
}
