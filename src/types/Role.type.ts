export interface IRole {
  id: number;
  code: string;
  name: string;
  description?: string;
  permissionIds: number[];
}

export interface RoleForm {
  code: string;
  name: string;
  description?: string;
  permissionIds: number[];
}
