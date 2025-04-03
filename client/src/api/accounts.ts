import { Account } from '../types/account';
import { request } from './util/agent';

const agent = request('/api/v1/accounts');

interface CreateAccountRequest {
    email: string;
    name: string;
    password: string;
}

export const AccountApi = {
    me: async (): Promise<Account> => {
        return agent({
            method: 'GET',
            url: '/me',
        });
    },

    list: async (): Promise<Account[]> => {
        return agent({
            method: 'GET',
            url: '',
        });
    },

    create(data: CreateAccountRequest): Promise<Account> {
        return agent({
            method: 'POST',
            url: '/create',
            data,
        });
    },

    enable(id: number): Promise<void> {
        return agent({
            method: 'PUT',
            url: `/${id}/enable`,
        });
    },

    updateRoles(id: number, roleIds: number[]): Promise<void> {
        return agent({
            method: 'PUT',
            url: `/${id}/roles`,
            data: { roleIds },
        });
    },

    delete(id: number) {
        return agent({
            method: 'DELETE',
            url: `/${id}`,
        });
    },
};