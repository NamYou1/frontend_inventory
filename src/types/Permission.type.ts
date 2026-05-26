export interface IPermission {
  id: number;
  code: string;
  name: string;
  description?: string;
  groupId: number;
  groupCode: string;
  groupName: string;
}

export interface IPermissionGroup {
  id: number;
  code: string;
  name: string;
  description?: string;
}
