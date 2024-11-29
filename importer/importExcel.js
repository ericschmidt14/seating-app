/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const xlsx = require("xlsx");

function convertExcelToFlatJson(filePath) {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

  const result = sheetData.map((row) => ({
    seatNumber: row["SeatNumber"],
    tableId: row["TableID"],
    occupant: {
      company: row["Company"] || "",
      firstName: row["First Name"] || "",
      lastName: row["Last Name"] || "",
      seasonTicket: false,
      info: row["Info"] || null,
    },
  }));

  return result;
}

const filePath = "./data.xlsx";
const outputFilePath = "./output.json";

try {
  const jsonData = convertExcelToFlatJson(filePath);
  fs.writeFileSync(outputFilePath, JSON.stringify(jsonData, null, 2));
  console.log(`Data successfully written to ${outputFilePath}`);
} catch (error) {
  console.error("Error processing Excel file:", error);
}
