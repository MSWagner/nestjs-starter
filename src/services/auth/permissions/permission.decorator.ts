import { SetMetadata } from "@nestjs/common";
import { PermissionScope } from "../../../entities/Permission.entity";

export const PERMISSION_KEY = "permissions";
export const Permissions = (...permissions: PermissionScope[]) => SetMetadata(PERMISSION_KEY, permissions);
