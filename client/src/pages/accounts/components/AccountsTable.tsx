import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import CheckBoxIcon from '@mui/icons-material/CheckBox';
import {
    Chip,
    Paper,
    Stack,
    Typography,
} from '@mui/material';
import {
    DataGrid,
    GridColDef,
} from '@mui/x-data-grid';
import { useQuery } from '@tanstack/react-query';

import { AccountApi } from '../../../api/accounts';
import { Account } from '../../../types/account';
import { humanReadable } from '../../../utils/time';

const EmailDataCell = ({ account }: {account: Account}) => {
    return (
        <Stack
            direction="row"
            alignItems="center"
            sx={{
                flexWrap: 'wrap',
                width: '100%', 
            }}
        >
       
            <Typography
                sx={{
                    wordBreak: 'break-word',
                    flex: 1,
                }}
            >
                {account.email}
            </Typography>

            {account.email_verified && <CheckBoxIcon color="success" />}
        </Stack>
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
                        />
                    );
                })
            }
        </Stack>
    );
};

const columns: GridColDef<Account>[] = [
    {
        field: 'id',
        headerName: 'ID',
        flex: 1,
    },
    {
        field: 'name',
        headerName: 'Name',
        sortable: false,
        flex: 1,
    },
    {
        field: 'email',
        headerName: 'Email',
        sortable: false,
        flex: 1,
        renderCell: ({ row }) => <EmailDataCell account={row} />,
    },
    {
        field: 'enabled',
        headerName: 'Enable',
        flex: 1,
        sortable: false,
    },
    {
        field: 'last_login_at',
        headerName: 'LastLogin',
        flex: 1,
        valueFormatter: (_, row) => humanReadable(row.last_login_at, true),
    },
    {
        field: 'roles',
        headerName: 'Roles',
        flex: 1,
        sortable: false,
        renderCell: ({ row }) => <RolesDataCell account={row} />,
    },
];

export const AccountsTable = () => {
    const dispatch = useDispatch();

    const {
        data: accounts,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ['accounts', 'list'],
        queryFn: AccountApi.list,
        refetchOnMount: true,
    });

    if (isLoading) {
        return (
            <div>is loading...</div>
        );
    }

    console.log(accounts);
    
    return (
        <Paper>
            <DataGrid
                rows={accounts}
                columns={columns}
                getRowHeight={() => 'auto'}
                autosizeOptions={{
                    includeHeaders: true,
                    includeOutliers: true,
                    outliersFactor: 1,
                    expand: true,
                }}
                sx={{
                    width: '100%',
                    height: '100%',
                    '& .MuiDataGrid-cell': {
                        whiteSpace: 'normal', // 允許換行
                        wordBreak: 'break-word', // 避免單一長字串超出
                    },
                }}
            />
        </Paper>
    );
};