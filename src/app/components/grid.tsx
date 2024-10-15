import { useSeating } from "../context/seatingContext";
import lounges from "../lounges.json";
import TableGroup from "./table";

export default function Grid() {
  const { lounge } = useSeating();

  const selectedLounge = lounges.find((l) => l.id === lounge)!;

  return (
    <main className="p-8 w-full h-full overflow-scroll">
      <div className="relative w-[200%] min-h-screen transform scale-75 origin-top-left">
        {selectedLounge.tables.map((t, index) => (
          <TableGroup
            key={index}
            id={t.id || ""}
            capacity={t.capacity || 0}
            x={t.x}
            y={t.y}
            round={t.round}
            right={t.right}
          />
        ))}
      </div>
    </main>
  );
}
