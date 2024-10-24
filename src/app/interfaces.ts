export interface Seat {
  id: string;
  tableId?: string;
  occupant?: {
    firstName: string;
    lastName: string;
    company: string;
    seasonTicket?: boolean;
  } | null;
}

export interface Table {
  id: string;
  capacity?: number;
  seats: Seat[];
}

export interface Game {
  id: string;
  season?: string;
  opponent: string;
  date: string;
  lounges: Array<Lounge>;
}

export interface Lounge {
  id: string;
  name: string;
  utilization: string;
  tables: Array<Table>;
}
