"use client";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { Seat, SelectedSeat, Table } from "../interfaces";

interface SeatingContextType {
  tables: Table[];
  setTables: Dispatch<SetStateAction<Table[]>>;
  selectedSeats: SelectedSeat[];
  setSelectedSeats: Dispatch<SetStateAction<SelectedSeat[]>>;
  selectedEmptySeats: Seat[];
  setSelectedEmptySeats: Dispatch<SetStateAction<Seat[]>>;
  handleSeatClick: (seat: SelectedSeat) => void;
}

const SeatingContext = createContext<SeatingContextType | undefined>(undefined);

export const SeatingProvider = ({ children }: { children: ReactNode }) => {
  const [tables, setTables] = useState<Table[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);
  const [selectedEmptySeats, setSelectedEmptySeats] = useState<Seat[]>([]);

  const handleSeatClick = (seat: SelectedSeat) => {
    setSelectedSeats((prevSelected: SelectedSeat[]) => {
      const isAlreadySelected = prevSelected.some(
        (s) => s.table === seat.table && s.seat === seat.seat
      );
      if (isAlreadySelected) {
        return prevSelected.filter(
          (s) => s.table !== seat.table || s.seat !== seat.seat
        );
      } else {
        return [...prevSelected, seat];
      }
    });
  };

  return (
    <SeatingContext.Provider
      value={{
        tables,
        setTables,
        selectedSeats,
        setSelectedSeats,
        selectedEmptySeats,
        setSelectedEmptySeats,
        handleSeatClick,
      }}
    >
      {children}
    </SeatingContext.Provider>
  );
};

export const useSeating = (): SeatingContextType => {
  const context = useContext(SeatingContext);
  if (!context) {
    throw new Error("useSeating must be used within an SeatingContext");
  }
  return context;
};
