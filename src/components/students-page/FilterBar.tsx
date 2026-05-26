"use client";

import { Box, Button, Stack, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";

interface Props {
  searchFilter: string;
  onSearchFilter: (query: string) => void;
  educationFilter: string;
  onEducationFilter: (education: string) => void;
  educationOptions: Array<{ value: string; label: string }>;
}

export default function FilterBar({
  searchFilter,
  onSearchFilter,
  educationFilter,
  onEducationFilter,
  educationOptions,
}: Readonly<Props>) {
  const { t } = useTranslation();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => onSearchFilter(e.target.value);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2.5,
        mb: 4,
        minWidth: 0,
        maxWidth: "1400px",
        mx: "auto",
        p: { xs: 1.5, sm: 2 },
        borderRadius: 3,
        backgroundColor: "rgba(255,255,255,0.55)",
        border: "1px solid rgba(0,88,65,0.14)",
      }}
    >
      <TextField
        fullWidth
        variant="outlined"
        placeholder={t("searchByName")}
        value={searchFilter}
        onChange={handleSearchChange}
        sx={{ minWidth: 0 }}
      />

      <Stack direction="row" spacing={1.2} flexWrap="wrap" useFlexGap>
        {educationOptions.map((option) => {
          const active = educationFilter === option.value;
          return (
            <Button
              key={option.value}
              onClick={() => onEducationFilter(option.value)}
              variant={active ? "contained" : "outlined"}
              sx={{
                borderRadius: "999px",
                px: 2.5,
                py: 0.9,
                textTransform: "none",
                fontWeight: 700,
                borderColor: "var(--color-green)",
                color: active ? "var(--color-white)" : "var(--color-green)",
                bgcolor: active ? "var(--color-green)" : "transparent",
                "&:hover": {
                  borderColor: "var(--color-green)",
                  bgcolor: active ? "var(--color-green-transparent)" : "rgba(0,88,65,0.08)",
                },
              }}
            >
              {option.label}
            </Button>
          );
        })}
      </Stack>
    </Box>
  );
}
