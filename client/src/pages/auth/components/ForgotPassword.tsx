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

interface ForgotPasswordProps {
    open: boolean;
    handleClose: () => void;
}

export default function ForgotPassword({
    open, handleClose, 
}: ForgotPasswordProps) {
    const { t } = useTranslation();

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            slotProps={{
                paper: {
                    component: 'form',
                    onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        handleClose();
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
                <Button onClick={handleClose}>
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
}