"use client";
import { ActionIcon, Slider } from "@mantine/core";
import { IconZoomIn, IconZoomOut } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useSeating } from "../context/seatingContext";
import { LOCAL_STORAGE_ZOOM_KEY } from "../lib/constants";
import Pitch from "./pitch";
import TableGroup from "./table";

export default function Grid() {
  const zoomStep = 0.1;
  const zoomMin = 0.4;
  const zoomInit = 0.8;
  const zoomMax = 1.2;

  const { tables, lounge } = useSeating();
  const [zoom, setZoom] = useState(zoomInit);

  useEffect(() => {
    const storedZoom = localStorage.getItem(LOCAL_STORAGE_ZOOM_KEY);
    if (storedZoom) {
      setZoom(JSON.parse(storedZoom));
    }
  }, []);

  const selectedLounge = tables.filter(
    (t) => t.loungeId === lounge && t.capacity! > 0
  )!;

  const handleZoomChange = (newZoom: number) => {
    const clampedZoom = Math.min(zoomMax, Math.max(zoomMin, newZoom));
    const fixedZoom = parseFloat(clampedZoom.toFixed(1));
    localStorage.setItem(LOCAL_STORAGE_ZOOM_KEY, JSON.stringify(fixedZoom));
    setZoom(fixedZoom);
  };

  return (
    <main className="p-8 w-full h-full overflow-scroll">
      <div
        className="relative min-h-screen"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: "top left",
          transition: "300ms transform ease-in-out",
          minWidth: lounge === 1 ? "200%" : "300%",
        }}
      >
        <Pitch />
        {selectedLounge.map((t, index) => (
          <TableGroup
            key={index}
            id={t.id}
            name={t.name}
            capacity={t.capacity || 0}
            x={t.x || 0}
            y={t.y || 0}
            round={t.isRound}
            right={t.isRight}
          />
        ))}
      </div>
      <div className="fixed bottom-8 left-8 z-50 flex items-center gap-4">
        <ActionIcon.Group>
          <ActionIcon
            aria-label="Zoom Out"
            variant="default"
            size="xl"
            onClick={() => handleZoomChange(zoom - zoomStep)}
            disabled={zoom <= zoomMin}
          >
            <IconZoomOut />
          </ActionIcon>
          <ActionIcon
            aria-label="Zoom In"
            variant="default"
            size="xl"
            onClick={() => handleZoomChange(zoom + zoomStep)}
            disabled={zoom >= zoomMax}
          >
            <IconZoomIn />
          </ActionIcon>
        </ActionIcon.Group>
        <Slider
          color="dark"
          w={120}
          label={null}
          value={zoom}
          onChange={(value) => handleZoomChange(value)}
          min={zoomMin}
          max={zoomMax}
          step={zoomStep}
          marks={[{ value: zoomInit }]}
        />
      </div>
    </main>
  );
}
