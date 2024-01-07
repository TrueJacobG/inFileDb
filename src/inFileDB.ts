import fs from "fs";
import { TableMetaData } from "./types/TableMetaData";
import { isJson } from "./utils/isJson";
import { validateMetaData } from "./validators/validateMetaData";

export class InFileDB {
  dbName: string;
  tablePaths: string[] = [];

  constructor(dbName: string) {
    this.dbName = "db/" + dbName;
    this.prepareFolder("db");
    this.prepareFolder(this.dbName);
  }

  createTable(tableName: string, metaData: TableMetaData[]) {
    let fixedMetaData = validateMetaData(metaData);

    const tablePath = this.dbName + "/" + tableName;
    this.prepareFolder(tablePath);
    this.prepareFile(tablePath, tableName);
    this.prepareFile(tablePath, "metaData");

    this.writeFile(tablePath, tableName, []);
    this.writeFile(tablePath, "metaData", fixedMetaData);

    this.tablePaths.push(tablePath);
  }

  readTableAsObject(tableName: string) {
    const file = fs.readFileSync(`${this.dbName}/${tableName}/${tableName}.json`);

    if (!isJson(file.toString())) {
      throw new Error("Error: File is not valid JSON!");
    }

    const data = JSON.parse(file.toString());
    return data;
  }

  prepareFolder(folderName: string) {
    if (!fs.existsSync(folderName)) {
      fs.mkdir(folderName, (e) => {
        if (e !== null) {
          console.error(e);
        }
      });
    }
  }

  prepareFile(path: string, fileName: string) {
    if (!fs.existsSync(path + "/" + fileName + ".json")) {
      fs.writeFile(path + "/" + fileName + ".json", "", (e) => {
        if (e !== null) {
          console.error(e);
        }
      });
    }
  }

  writeFile(path: string, fileName: string, data: object[] | object) {
    fs.writeFile(path + "/" + fileName + ".json", JSON.stringify(data), function (e) {
      if (e) {
        console.error(e);
      }
    });
  }

  deleteDatabase() {
    if (fs.existsSync("db")) {
      fs.rmdir("db", (e) => {
        if (e !== null) {
          console.error(e);
        }
      });
    }
  }
}
