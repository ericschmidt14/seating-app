"use client";
import { ActionIcon, Table, TextInput } from "@mantine/core";
import { IconSearch, IconX } from "@tabler/icons-react";
import { useSeating } from "../context/seatingContext";
import { useState } from "react";
import { Seat } from "../interfaces";

export default function List() {
  const { tables, selectedSeats, handleSeatClick } = useSeating();
  const [search, setSearch] = useState("");

  const keywords = search.trim().split(/\s+/);
  const searchKeyword = (seat: Seat) =>
    keywords.every((keyword) =>
      [
        seat.occupant?.firstName,
        seat.occupant?.lastName,
        seat.occupant?.company,
      ].some((s) => s!.toLowerCase().includes(keyword.toLowerCase()))
    );

  return (
    <>
      <TextInput
        leftSection={<IconSearch size={16} />}
        rightSection={
          search.length > 0 ? (
            <ActionIcon
              onClick={() => setSearch("")}
              className="cursor-pointer"
              variant="default"
            >
              <IconX size={16} />
            </ActionIcon>
          ) : null
        }
        placeholder="Person oder Firma suchen ..."
        value={search}
        onChange={(event) => setSearch(event.currentTarget.value)}
      />
      <div className="flex flex-col gap-4">
        {tables.map(
          (t, index) =>
            t.seats.length > 0 &&
            t.seats.filter((seat) => searchKeyword(seat)).length > 0 && (
              <Table highlightOnHover key={index}>
                <Table.Tbody>
                  {t.seats
                    .filter((seat) => searchKeyword(seat))
                    .map((s, index) => (
                      <Table.Tr
                        key={index}
                        className="cursor-pointer"
                        bg={
                          selectedSeats.find(
                            (selected) =>
                              selected.id === s.id && selected.tableId === t.id
                          )
                            ? "#b3193e"
                            : undefined
                        }
                        onClick={() =>
                          handleSeatClick({ tableId: t.id, id: s.id }, true)
                        }
                      >
                        <Table.Td>
                          {s.occupant && s.occupant.lastName && (
                            <b className="text-lg tracking-tighter pr-2">
                              {s.occupant.firstName} {s.occupant.lastName}{" "}
                            </b>
                          )}
                          {s.occupant && s.occupant.company}
                        </Table.Td>
                        <Table.Td align="right">
                          {t.id} – {s.id}
                        </Table.Td>
                      </Table.Tr>
                    ))}
                </Table.Tbody>
              </Table>
            )
        )}
      </div>
    </>
  );
}
