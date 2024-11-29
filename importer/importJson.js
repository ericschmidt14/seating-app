// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require("fs");

function transformSeats(data, filterBySeasonTicket) {
  const filteredSeats = [];

  data.forEach((section) => {
    if (!section.seats) return;

    section.seats.forEach((seat) => {
      if (seat.occupant.seasonTicket === filterBySeasonTicket) {
        filteredSeats.push({
          seatNumber: seat.seatNumber,
          tableId: section.id,
          occupant: seat.occupant,
        });
      }
    });
  });

  return filteredSeats;
}

fs.readFile("./data.json", "utf-8", (err, fileData) => {
  if (err) {
    console.error("Error reading data.json:", err);
    return;
  }

  try {
    const data = JSON.parse(fileData);
    const seatsWithSeasonTickets = transformSeats(data, true);
    const seatsWithoutSeasonTickets = transformSeats(data, false);

    fs.writeFile(
      "output_with_season_tickets.json",
      JSON.stringify(seatsWithSeasonTickets, null, 2),
      (err) => {
        if (err) {
          console.error(
            "Error writing to output_with_season_tickets.json:",
            err
          );
        } else {
          console.log(
            "Seats with season tickets have been written to output_with_season_tickets.json"
          );
        }
      }
    );

    fs.writeFile(
      "output_without_season_tickets.json",
      JSON.stringify(seatsWithoutSeasonTickets, null, 2),
      (err) => {
        if (err) {
          console.error(
            "Error writing to output_without_season_tickets.json:",
            err
          );
        } else {
          console.log(
            "Seats without season tickets have been written to output_without_season_tickets.json"
          );
        }
      }
    );
  } catch (parseErr) {
    console.error("Error parsing data.json:", parseErr);
  }
});
