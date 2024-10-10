import { useSeating } from "../context/seatingContext";
import lounges from "../lounges.json";
import TableGroup from "./table";

export default function Grid() {
  const { lounge } = useSeating();

  const selectedLounge = lounges.find((l) => l.id === lounge)!;

  return (
    <main
      className="grid gap-4 p-8"
      style={{
        gridTemplateColumns: `repeat(${selectedLounge.rows}, 1fr)`,
      }}
    >
      {selectedLounge.tables.map((t, index) => (
        <TableGroup
          key={index}
          id={t.id || ""}
          capacity={t.capacity || 0}
          round={t.round}
        />
      ))}
    </main>
  );
}
