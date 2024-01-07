import { CompatibleType } from "./CompatibleType";

export type TableMetaData = {
  name: string;
  type: string;
  required?: boolean; // default: false
  default?: CompatibleType;
  min?: number; // default: 0
  max?: number; // default: 100
};
