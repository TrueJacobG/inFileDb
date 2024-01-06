import { InFileDB } from "./inFileDB";
const db = new InFileDB("db1");

db.createTable("table1");
db.readTableAsObject("table1");

// db.deleteDatabase();

console.log("Works");
