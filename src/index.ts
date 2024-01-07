import { InFileDB } from "./inFileDB";
const db = new InFileDB("db1");

db.createTable("table1", [
  { name: "id", type: "number", required: true },
  { name: "name", type: "string", required: true, min: 3, max: 15 },
  { name: "birthDate", type: "Date", required: true },
  { name: "isDoubleAgent", type: "boolean", default: false },
  { name: "agentName", type: "string", default: "John" },
]);

// error for now: ?
// let outPut = db.readTableAsObject("table1");
// console.log(outPut);

// db.deleteDatabase();

console.log("Works");
