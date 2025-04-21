import {
    forwardRef,
    useImperativeHandle,
    useState,
} from 'react';

import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
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
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';

import { AuthApi } from '../../../api/auth';
import { Regex } from '../../../utils/regex';

export interface VerifyEmailRef {
    toggleOpen: (target: boolean) => void;
}

type FormValues = {
    email: string;
    verificationCode: string;
};

const formSchema = yup.object({
    email: yup
        .string()
        .required('此為必填欄位')
        .test('email', 'Please enter a valid email address.', (value) => {
            return Regex.email.test(value);
        }),
    verificationCode: yup
        .string()
        .required('此為必填欄位'),
});

export const VerifyEmail = forwardRef<VerifyEmailRef>((_, ref) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const [tabValue, setTabValue] = useState('1');

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
        },
    });

    const verifyEmailMutation = useMutation({
        mutationFn: AuthApi.verifyCode,
        onSuccess: () => {
            // TODO: notification

            navigate('/sign-in');
        },
        onError: (error: any) => {
            console.error(error);
        },
    });

    const onSubmit = (data: FormValues) => {
        verifyEmailMutation.mutate({
            email: data.email,
            verificationCode: data.verificationCode,
        });
    };

    useImperativeHandle(ref, () => ({ toggleOpen }));

    return (
        <Dialog
            open={open}
            onClose={() => toggleOpen(false)}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogTitle>
                    {t('view_auth.title_verify_email')}
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
                            {t('view_auth.message_verify_email_description')}
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

                        <TextField
                            {...register('verificationCode')}
                            error={!!errors.verificationCode}
                            helperText={errors.verificationCode?.message}
                            required
                            variant="outlined"
                            id="verificationCode"
                            name="verificationCode"
                            placeholder="Enter code"
                            fullWidth
                        />
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
                    >
                        {t('common.btn_continue')}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
});