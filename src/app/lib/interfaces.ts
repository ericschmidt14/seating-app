export interface Game {
  year: number;
  day: number;
  opponent: string;
  date: string;
  lounges?: Array<Lounge>;
}

export interface Lounge {
  id: number;
  loungeId: number;
  name?: string;
  utilization: string;
  tables: Array<Table>;
}

export interface Table {
  id: number;
  name: string;
  loungeId: number;
  capacity?: number;
  isRound?: boolean;
  isRight?: boolean;
  x?: number;
  y?: number;
  seats: Seat[] | null;
}

export interface Seat {
  seatNumber: number;
  tableId?: number;
  occupant?: Occupant | null;
}

export interface Occupant {
  firstName: string;
  lastName: string;
  company: string;
  info: string;
  seasonTicket?: boolean;
}

export interface App {
  game: Array<Game>;
  games: Array<Game>;
  tables: Array<Table>;
}
