import {
    forwardRef,
    useImperativeHandle,
    useState,
} from 'react';

import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { yupResolver } from '@hookform/resolvers/yup';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Typography,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';

import { AuthApi } from '../../../api/auth';
import { Regex } from '../../../utils/regex';

export interface ResendVerifyCodeRef {
    toggleOpen: (target: boolean) => void;
}

type FormValues = {
    email: string;
};

const formSchema = yup.object({
    email: yup
        .string()
        .required('此為必填欄位')
        .test('email', 'Please enter a valid email address.', (value) => {
            return Regex.email.test(value);
        }),
});

export const ResendVerifyCode = forwardRef<ResendVerifyCodeRef>((_, ref) => {
    const { t } = useTranslation();

    const [open, setOpen] = useState(false);
    const [isCoolingDown, setIsCoolingDown] = useState(false);

    const toggleOpen = (target: boolean) => {
        setOpen(target);
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({ resolver: yupResolver(formSchema) });

    const resendVerificationCodeMutation = useMutation({
        mutationFn: AuthApi.sendVerificationCode,
        onSuccess: () => {
        },
        onError: (error: any) => {
            console.error(error);
            
            if (error.status === 400) {
                setIsCoolingDown(true);
                setTimeout(() => setIsCoolingDown(false), 5000);
            }
        },
    });

    const onSubmit = (data: FormValues) => {
        resendVerificationCodeMutation.mutate({ email: data.email });
    };

    useImperativeHandle(ref, () => ({ toggleOpen }));

    return (
        <>
            <Dialog
                open={open}
                onClose={() => toggleOpen(false)}
            >
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogTitle>
                        {t('view_auth.title_resend_verify')}
                    </DialogTitle>
                    <DialogContent sx={{ minWidth: '300px' }}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                width: '100%',
                                gap: 2,
                            }}
                        >
                            <DialogContentText>
                                {t('view_auth.message_enter_email_to_receive_verification_code')}
                            </DialogContentText>

                            <TextField
                                {...register('email')}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                                required
                                variant="outlined"
                                id="email"
                                name="email"
                                placeholder="your@email.com"
                                type="email"
                                fullWidth
                            />

                            {isCoolingDown && <Typography color="error">{t('view_auth.message_already_send_verify_code')}</Typography>}
                        </Box>
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
                            disabled={isCoolingDown}
                        >
                            {t('common.btn_continue')}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
});