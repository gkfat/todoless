import { Account } from '../types/account';
import { DashboardConfig } from '../types/dashboard';
import { request } from './util/agent';

const agent = request('/api/v1/accounts');

interface CreateAccountRequest {
    email: string;
    name: string;
    password: string;
}

interface UpdateAccountConfigRequest {
    accountId: number;
    dashboardConfigs: DashboardConfig[];
}

interface UpdateAccountRequest {
    name: string;
    password?: string;
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

    update(id: number, data: UpdateAccountRequest): Promise<void> {
        return agent({
            method: 'PUT',
            url: `/${id}/update`,
            data,
        });
    },

    updateConfig(data: UpdateAccountConfigRequest): Promise<Account> {
        return agent({
            method: 'PUT',
            url: `/${data.accountId}/update-config`,
            data,
        });
    },

    delete(id: number) {
        return agent({
            method: 'DELETE',
            url: `/${id}`,
        });
    },
};