import fs from "fs";
import { TableMetaData } from "./types/TableMetaData";
import { isJson } from "./utils/isJson";

export class InFileDB {
  dbName: string;
  tablePaths: string[] = [];

  constructor(dbName: string) {
    this.dbName = "db/" + dbName;
    this.prepareFolder("db");
    this.prepareFolder(this.dbName);
  }

  createTable(tableName: string, metaData: TableMetaData[]) {
    let fixedMetaData = this.validateMetaData(metaData);

    const tablePath = this.dbName + "/" + tableName;
    this.prepareFolder(tablePath);
    this.prepareFile(tablePath, tableName);
    this.prepareFile(tablePath, "metaData");

    this.writeFile(tablePath, "metaData", fixedMetaData);

    this.tablePaths.push(tablePath);
  }

  validateMetaData(metaData: TableMetaData[]) {
    metaData.map((col) => {
      if (!("name" in col) || !("type" in col)) {
        throw new Error("Error: Column must have a name and type!");
      }

      if (!("default" in col) && (!("required" in col) || col.required === false)) {
        throw new Error(`Error: Column must have a default value or be required -> Column Name: ${col.name}!`);
      }

      if (!("required" in col)) {
        col.required = false;
      }

      if (!("default" in col) && col.required === false) {
        col.default = null;
      }

      if (!("min" in col) && col.type === "string") {
        col.min = 0;
      }
      if (!("max" in col) && col.type === "string") {
        col.max = 100;
      }

      return col;
    });

    return metaData;
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

  writeFile(path: string, fileName: string, data: object[]) {
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
