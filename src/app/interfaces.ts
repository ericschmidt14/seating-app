export interface Seat {
  id: string;
  tableId?: string;
  occupant?: { firstName: string; lastName: string; company: string };
}

export interface SelectedSeat {
  table: string;
  seat: string;
}

export interface Table {
  id: string;
  capacity: number;
  seats: Seat[];
}
