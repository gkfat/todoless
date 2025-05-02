import {
    forwardRef,
    useImperativeHandle,
    useRef,
    useState,
} from 'react';

import { useTranslation } from 'react-i18next';
import {
    useDispatch,
    useSelector,
} from 'react-redux';

import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import {
    Chip,
    Stack,
    Switch,
} from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import {
    useMutation,
    useQuery,
} from '@tanstack/react-query';

import { AccountApi } from '../../../api/accounts';
import { AppDataGrid } from '../../../components/AppDataGrid';
import { Permissions } from '../../../enums/permissions.enum';
import { RoleEnum } from '../../../enums/role';
import { RootState } from '../../../store';
import { havePermissions } from '../../../store/authSlice';
import { showNotification } from '../../../store/notificationSlice';
import { Account } from '../../../types/account';
import { humanReadable } from '../../../utils/time';
import {
    EnableAccountDialog,
    EnableAccountDialogRef,
} from './EnableAccountDialog';

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
    const dispatch = useDispatch();
    const enableAccountDialogRef = useRef<EnableAccountDialogRef>(null);
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null); 

    const havePermissionsTo = { enableAccount: useSelector((state: RootState) => havePermissions(state, [Permissions.account.accounts.update])) };

    const handleClickEnable = (account: Account) => {
        if (!havePermissionsTo.enableAccount || account.roles.some((r) => r.role === RoleEnum.SUPER)) {
            return;
        }
        
        setSelectedAccount(account);
        enableAccountDialogRef.current?.setOpen(true);
    };

    const enableAccountMutation = useMutation({
        mutationFn: AccountApi.enable,
        onSuccess: () => {
            enableAccountDialogRef.current?.setOpen(false);
            
            dispatch(showNotification({
                message: t('view_accounts.message_enbale_account_successfully'),
                type: 'success',
            }));

            refetch();
        },
        onError: (error: any) => {
            console.error(error);
        },
    });

    const handleConfirmEnable = () => {
        if (!selectedAccount) {
            return;
        }

        enableAccountMutation.mutate(selectedAccount.id);
    };

    const handleCancelEnable = () => {
        enableAccountDialogRef.current?.setOpen(false);
    };

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
            renderCell: ({ row }) => <Switch
                color="success"
                checked={row.enabled}
                onChange={() => handleClickEnable(row)}
            />,
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
            valueFormatter: (_, row) => row.last_login_at ?  humanReadable(row.last_login_at, true) : '-',
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
        <>
            <AppDataGrid
                rows={accounts ?? []}
                columns={columns}
                loading={isLoading}
            />

            { selectedAccount && <EnableAccountDialog
                ref={enableAccountDialogRef}
                account={selectedAccount}
                handleConfirm={handleConfirmEnable}
                handleCancel={handleCancelEnable}
            />}
           
        </>
    );
});