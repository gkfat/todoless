import { SetMetadata } from '@nestjs/common';

// FIXME: 應可傳入多個 permissions
export const PERMISSIONS_KEY = 'permissions';
export const RequirePermissions = (...permissions: string[]) => SetMetadata(PERMISSIONS_KEY, permissions);