import * as fs from "fs";
import * as XLSX from "xlsx";

interface TableEntry {
  id: string;
  name: string;
}

interface ExcelRow {
  Table: number;
  Company?: string;
  Amount: number;
}

interface Occupant {
  company: string;
  firstName: string;
  lastName: string;
  seasonTicket: boolean;
}

interface OutputRow {
  tableId: string;
  seatNumber: number;
  occupant: Occupant;
}

function transformExcelToJson(
  excelFilePath: string,
  tablesFilePath: string
): OutputRow[] {
  const tables: TableEntry[] = JSON.parse(
    fs.readFileSync(tablesFilePath, "utf-8")
  );

  const getTableIdByName = (tableName: number): string | null => {
    const table = tables.find((entry) => entry.name === tableName.toString());
    return table ? table.id : null;
  };

  const workbook = XLSX.readFile(excelFilePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  const rawData: ExcelRow[] = XLSX.utils.sheet_to_json(sheet) as ExcelRow[];

  const result: OutputRow[] = [];
  const tableSeatMap: { [tableId: string]: number } = {};

  for (const row of rawData) {
    const { Table: tableName, Company, Amount } = row;

    if (!Company) {
      console.warn(
        `Skipping row: No company specified for table "${tableName}"`
      );
      continue;
    }

    const tableId = getTableIdByName(tableName);
    if (!tableId) {
      console.error(
        `Error: Table name "${tableName}" not found in tables.json.`
      );
      continue;
    }

    if (!tableSeatMap[tableId]) {
      tableSeatMap[tableId] = 0;
    }

    for (let i = 1; i <= Amount; i++) {
      tableSeatMap[tableId]++;
      result.push({
        tableId: tableId,
        seatNumber: tableSeatMap[tableId],
        occupant: {
          company: Company.trim(),
          firstName: "",
          lastName: "",
          seasonTicket: false,
        },
      });
    }
  }

  return result;
}

const excelFilePath = "./importer/data.xlsx";
const tablesFilePath = "./importer/tables.json";
const outputFilePath = "./importer/dist/output.json";

const transformedData = transformExcelToJson(excelFilePath, tablesFilePath);

fs.writeFileSync(outputFilePath, JSON.stringify(transformedData, null, 2));

console.log("JSON data has been written to", outputFilePath);
