export function ErrorText({ text }: Readonly<{ text?: string }>) {
  if (!text) return null;
  return (
    <div style={{ color: "crimson", marginTop: 8, fontSize: 13 }}>{text}</div>
  );
}
