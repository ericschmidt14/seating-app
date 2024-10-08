"use client";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { SelectedSeat, Table } from "../interfaces";

interface SeatingContextType {
  tables: Table[];
  setTables: Dispatch<SetStateAction<Table[]>>;
  selectedSeats: SelectedSeat[];
  setSelectedSeats: Dispatch<SetStateAction<SelectedSeat[]>>;
}

const SeatingContext = createContext<SeatingContextType | undefined>(undefined);

export const SeatingProvider = ({ children }: { children: ReactNode }) => {
  const [tables, setTables] = useState<Table[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);

  return (
    <SeatingContext.Provider
      value={{ tables, setTables, selectedSeats, setSelectedSeats }}
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
