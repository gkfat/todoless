import {
    forwardRef,
    useImperativeHandle,
    useState,
} from 'react';

import { useTranslation } from 'react-i18next';

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    OutlinedInput,
} from '@mui/material';

export interface ForgotPasswordRef {
    toggleOpen: (target: boolean) => void;
}

export const ForgotPassword = forwardRef<ForgotPasswordRef>((_, ref) => {
    const { t } = useTranslation();

    const [open, setOpen] = useState(false);

    const toggleOpen = (target: boolean) => {
        setOpen(target);
    };
    
    useImperativeHandle(ref, () => ({ toggleOpen }));
    
    return (
        <Dialog
            open={open}
            onClose={() => toggleOpen(false)}
            slotProps={{
                paper: {
                    component: 'form',
                    onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        toggleOpen(false);
                    },
                    sx: { backgroundImage: 'none' },
                },
            }}
        >
            <DialogTitle>
                {t('view_auth.title_reset_password')}
            </DialogTitle>
            <DialogContent
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    width: '100%', 
                }}
            >
                <DialogContentText>
                    {t('view_auth.message_reset_password_description')}
                </DialogContentText>
                <OutlinedInput
                    autoFocus
                    required
                    margin="dense"
                    id="email"
                    name="email"
                    label="Email address"
                    placeholder="Email address"
                    type="email"
                    fullWidth
                />
            </DialogContent>
            <DialogActions
                sx={{
                    pb: 3,
                    px: 3, 
                }}
            >
                <Button onClick={() => toggleOpen(false)}>
                    {t('common.btn_cancel')}
                </Button>
                <Button
                    variant="contained"
                    type="submit"
                >
                    {t('common.btn_continue')}
                </Button>
            </DialogActions>

        </Dialog>
    );
});