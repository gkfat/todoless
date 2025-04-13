import { Role } from './roles';

export interface Account {
    id: number;
    email: string;
    email_verified: boolean;
    name: string;
    avatar: string;
    enabled: boolean;
    last_login_at: string;
    create_at: string;
    update_at: string | null;
    roles: Role[];
    permissions: string[];
}