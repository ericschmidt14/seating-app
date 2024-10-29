import { ActionIcon } from "@mantine/core";
import { IconZoomIn, IconZoomOut } from "@tabler/icons-react";
import { useState } from "react";
import { useSeating } from "../context/seatingContext";
import lounges from "../lounges.json";
import TableGroup from "./table";

export default function Grid() {
  const { lounge } = useSeating();
  const [zoom, setZoom] = useState(0.8);

  const selectedLounge = lounges.find((l) => l.id === lounge)!;
  const zoomStep = 0.1;

  return (
    <main className="p-8 w-full h-full overflow-scroll">
      <div
        className="relative min-h-screen transform origin-top-left"
        style={{
          transform: `scale(${zoom})`,
          transition: "300ms transform ease-in-out",
          minWidth: selectedLounge.id === "1" ? "200%" : "300%",
        }}
      >
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
      <ActionIcon.Group className="fixed bottom-8 left-8 z-50">
        <ActionIcon
          aria-label="Zoom In"
          variant="default"
          size="xl"
          onClick={() => setZoom(zoom + zoomStep)}
        >
          <IconZoomIn />
        </ActionIcon>
        <ActionIcon
          aria-label="Zoom Out"
          variant="default"
          size="xl"
          onClick={() => setZoom(zoom - zoomStep)}
        >
          <IconZoomOut />
        </ActionIcon>
      </ActionIcon.Group>
    </main>
  );
}
