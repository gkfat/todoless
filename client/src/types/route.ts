import { JSX } from 'react';

import { RoleEnum } from '../enums/role';

export interface AppRoute {
    path: string;
    element: JSX.Element;
    name?: string;
    icon?: JSX.Element;
    roles?: RoleEnum[]; // null 或 undefined 表示不需權限
    children?: AppRoute[];
  }