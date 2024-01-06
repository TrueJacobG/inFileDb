import fs from "fs";

export class InFileDB {
  dbName: string;
  tablePaths: string[] = [];

  constructor(dbName: string) {
    this.dbName = "db/" + dbName;
    this.prepareFolder("db");
    this.prepareFolder(this.dbName);
  }

  createTable(tableName: string) {
    const tablePath = this.dbName + "/" + tableName;
    this.prepareFolder(tablePath);
    this.prepareFile(tablePath, tableName);
    this.prepareFile(tablePath, "metaData");

    this.tablePaths.push(tablePath);
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
