import {
    forwardRef,
    useImperativeHandle,
} from 'react';

import { useTranslation } from 'react-i18next';

import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import {
    Chip,
    Stack,
} from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { useQuery } from '@tanstack/react-query';

import { AccountApi } from '../../../api/accounts';
import { AppDataGrid } from '../../../components/AppDataGrid';
import { Account } from '../../../types/account';
import { humanReadable } from '../../../utils/time';

const TrueFalseIcon = ({ value }: {value: boolean}) => {
    return (
        value
            ? <CheckIcon color="success" />
            :  <CloseIcon color="error" />
    );
};

const RolesDataCell = ({ account }: {account: Account}) => {
    const { t } = useTranslation();
    
    return (
        <Stack
            direction="row"
            alignItems="center"
            sx={{
                flexWrap: 'wrap',
                width: '100%', 
            }}
        >
            {
                account.roles.map((role, i) => {
                    return (
                        <Chip
                            key={i}
                            label={t(`roles.${role.role}`)}
                            size="small"
                        />
                    );
                })
            }
        </Stack>
    );
};

export const AccountsTable = forwardRef((_, ref) => {
    const { t } = useTranslation();

    const columns: GridColDef<Account>[] = [
        {
            field: 'id',
            headerName: 'ID',
            flex: 1,
        },
        {
            field: 'create_at',
            headerName: t('view_accounts.label_create_at'),
            flex: 1,
            valueFormatter: (_, row) => humanReadable(row.create_at),
        },
        {
            field: 'name',
            headerName: t('view_accounts.label_name'),
            sortable: false,
            flex: 1,
        },
        {
            field: 'email',
            headerName: 'Email',
            sortable: false,
            flex: 1,
        },
        {
            field: 'email_verified',
            headerName: t('view_accounts.label_email_verified'),
            flex: 1,
            sortable: false,
            renderCell: ({ row }) => <TrueFalseIcon value={row.email_verified} />,
        },
        {
            field: 'enabled',
            headerName: t('view_accounts.label_enabled'),
            flex: 1,
            sortable: false,
            renderCell: ({ row }) => <TrueFalseIcon value={row.enabled} />,
        },
        {
            field: 'roles',
            headerName: t('view_accounts.label_roles'),
            flex: 1,
            sortable: false,
            renderCell: ({ row }) => <RolesDataCell account={row} />,
        },
        {
            field: 'last_login_at',
            headerName: t('view_accounts.label_last_login_at'),
            flex: 1,
            valueFormatter: (_, row) => humanReadable(row.last_login_at, true),
        },
    ];

    const {
        data: accounts,
        isLoading,
        isError,
        refetch,
    } = useQuery({
        queryKey: ['accounts', 'list'],
        queryFn: AccountApi.list,
        refetchOnMount: true,
    });

    // 將 refetch 暴露給父元件使用
    useImperativeHandle(ref, () => ({ refetch }));

    if (isError) {
        return (
            <div>
                Fetching data error.
            </div>
        );
    }

    return (
        <AppDataGrid
            rows={accounts ?? []}
            columns={columns}
            loading={isLoading}
        />
    );
});