export default function Tab({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className={`py-2 cursor-pointer ${
        active ? "text-white/100" : "text-white/30"
      } hover:text-white/100 transition-all`}
      style={{
        borderBottom: active ? "1px solid white" : "",
        fontSize:
          "var(--input-fz, var(--input-fz, var(--mantine-font-size-sm)))",
      }}
      onClick={onClick}
    >
      {label}
    </div>
  );
}
