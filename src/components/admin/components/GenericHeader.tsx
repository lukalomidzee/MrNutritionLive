import { Box, Button, Typography } from "@mui/material";

interface GenericHeaderProps {
  title: string;
  onAdd: () => void;
  addLabel?: string;
}

export default function GenericHeader({
  title,
  onAdd,
  addLabel = "Add",
}: Readonly<GenericHeaderProps>) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <Typography variant="h5" fontWeight={700}>
        {title}
      </Typography>
      <Button variant="contained" onClick={onAdd} sx={{ borderRadius: 1 }}>
        {addLabel}
      </Button>
    </Box>
  );
}
