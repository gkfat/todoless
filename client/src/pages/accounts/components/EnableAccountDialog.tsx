import {
    forwardRef,
    useImperativeHandle,
    useState,
} from 'react';

import { useTranslation } from 'react-i18next';

import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Stack,
    Typography,
} from '@mui/material';

import { Account } from '../../../types/account';

export interface EnableAccountDialogRef {
    setOpen: (target: boolean) => void;
}

interface EnableAccountDialogProps {
    account: Account;
    handleConfirm: () => void;
    handleCancel: () => void;
}

export const EnableAccountDialog = forwardRef<EnableAccountDialogRef, EnableAccountDialogProps>((props, ref) => {
    const { t } = useTranslation();
    const {
        account, handleConfirm, handleCancel, 
    } = props;
    
    const [open, setOpen] = useState(false);

    useImperativeHandle(ref, () => ({ setOpen }));
    
    return (
        <Dialog
            open={open}
            onClose={handleCancel}
        >
            <DialogTitle>
                {t('view_accounts.title_confirm_enable')}
            </DialogTitle>
            
            <DialogContent sx={{ p: 2 }}>
                <Stack
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Typography
                        variant="h4"
                        fontWeight="bold"
                    >
                        {
                            account.enabled && t('view_accounts.message_confirm_disble_account', { email: account.email })
                        }

                        {
                            !account.enabled && t('view_accounts.message_confirm_enable_account', { email: account.email })
                        }
                    </Typography>
                </Stack>
            </DialogContent>
            
            <DialogActions>
                <IconButton
                    onClick={handleConfirm}
                >
                    <CheckIcon color="success" />
                </IconButton>

                <IconButton
                    onClick={handleCancel}
                >
                    <ClearIcon color="secondary" />
                </IconButton>
            </DialogActions>
        </Dialog>
    );
});