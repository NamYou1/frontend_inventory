export interface IUnit {
  id: number;
  baseUnit: number;
  code: string;
  name: string;
  operation: string;
  operationValue: string;
  status: string;
}

export interface UnitForm {
  baseUnit?: number;
  code: string;
  name: string;
  operation?: string;
  operationValue?: number;
  status?: string;
}

export interface UnitFilter {
  page?: number;
  size?: number;
  name?: string;
  status?: string;
}
