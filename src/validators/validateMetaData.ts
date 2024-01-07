import { TableMetaData } from "../types/TableMetaData";

export const validateMetaData = (metaData: TableMetaData[]) => {
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
};
