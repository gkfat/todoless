export const Permissions = {
    /**
     * 帳號相關
     */
    account: {
        me: {
            get: 'account.me.get',
            update: 'account.me.update',
        },
        accounts: {
            get: 'account.accounts.get',
            add: 'account.accounts.add',
            update: 'account.accounts.update',
            delete: 'account.accounts.delete',
        },
    },

    dashboard: { dashboard: { get: 'dashboard.dashboard.get' } },

    /**
     * 權限相關
     */
    privilege: { roles: { get: 'privilege.roles.get' } },

    /**
     * 標籤相關
     */
    label: {
        labels: {
            get: 'label.labels.get',
            add: 'label.labels.add',
            update: 'label.labels.update',
            delete: 'label.labels.delete', 
        }, 
    },

    /**
     * 待辦相關
     */
    todo: {
        todos: {
            get: 'todo.todos.get',
            add: 'todo.todos.add',
            update: 'todo.todos.update',
            delete: 'todo.todos.delete', 
        }, 
    },
};
