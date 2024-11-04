export interface Game {
  id: string;
  season?: string;
  opponent: string;
  date: string;
  lounges: Array<Lounge>;
}

export interface Lounge {
  id: number;
  name: string;
  utilization: string;
  tables: Array<Table>;
}

export interface Table {
  id: number;
  capacity?: number;
  round?: boolean;
  right?: boolean;
  x?: number;
  y?: number;
  seats: Seat[];
}

export interface Seat {
  id: number;
  tableId?: number;
  occupant?: Occupant | null;
}

export interface Occupant {
  firstName: string;
  lastName: string;
  company: string;
  seasonTicket?: boolean;
}
