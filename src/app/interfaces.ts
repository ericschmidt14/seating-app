export interface Seat {
  id: string;
  tableId?: string;
  occupant?: { firstName: string; lastName: string; company: string } | null;
}

export interface Table {
  id: string;
  capacity?: number;
  seats: Seat[];
}
