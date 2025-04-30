import { useRef } from 'react';

import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import {
    NavLink,
    useNavigate,
} from 'react-router-dom';
import * as yup from 'yup';

import { yupResolver } from '@hookform/resolvers/yup';
import {
    Box,
    Button,
    CssBaseline,
    Divider,
    FormControl,
    FormLabel,
    Link,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';

import { AuthApi } from '../../../api/auth';
import { LanguageSelector } from '../../../components/LanguageSelector';
import {
    login,
    setAccount,
} from '../../../store/authSlice';
import { showNotification } from '../../../store/notificationSlice';
import { Regex } from '../../../utils/regex';
import { Card } from '../components/Card';
import { Container } from '../components/Container';
import {
    ForgotPassword,
    ForgotPasswordRef,
} from '../components/ForgotPassword';
import {
    ResendVerifyCode,
    ResendVerifyCodeRef,
} from '../components/ResendVerifyCode';

type FormValues = {
    email: string;
    password: string;
};

const formSchema = yup.object({
    email: yup
        .string()
        .required('此為必填欄位')
        .test('email', 'Please enter a valid email address.', (value) => {
            return Regex.email.test(value);
        }),
    password: yup
        .string()
        .required('此為必填欄位')
        .test('password', 'Password must be contains at least 1 character and 1 digit, between 6 ~ 10 long.', (value) => {
            return Regex.password.test(value);
        }),
});

export const SignInPage = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const resendVerifyCodeRef = useRef<ResendVerifyCodeRef>(null);
    const forgotPasswordRef = useRef<ForgotPasswordRef>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({ resolver: yupResolver(formSchema) });
 
    const signInMutation = useMutation({
        mutationFn: AuthApi.signIn,
        onSuccess: (response) => {
            const {
                token, account, 
            } = response;

            dispatch(showNotification({
                message: t('view_auth.message_sign_in_successfully', { name: account.name }),
                type: 'success',
            }));
                    
            dispatch(login(token));
            dispatch(setAccount(account));
            navigate('/dashboard');
        },
        onError: (error: any) => {
            console.error(error);
        },
    });

    const onSubmit = (data: FormValues) => {
        signInMutation.mutate({
            type: 'password',
            email: data.email,
            password: data.password,
        });
    };

    return (
        <div>
            <CssBaseline enableColorScheme />

            <Container
                direction="column"
                justifyContent="space-between"
            >
                <Card
                    variant="outlined"
                    sx={{ backgroundColor: 'white' }}
                >
                    <Stack direction="row">
                        <Typography
                            component="h1"
                            variant="h4"
                            sx={{ width: '100%' }}
                        >
                            {t('view_auth.title_sign_in')}
                        </Typography>

                        <LanguageSelector />
                    </Stack>
                    <Box
                        component="form"
                        onSubmit={handleSubmit(onSubmit)}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                            gap: 2,
                        }}
                    >
                        <FormControl>
                            <FormLabel htmlFor="email">Email</FormLabel>
                            <TextField
                                {...register('email')}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                                id="email"
                                placeholder="your@email.com"
                                autoComplete="email"
                                required
                                fullWidth
                                variant="outlined"
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel htmlFor="password">Password</FormLabel>
                            <TextField
                                {...register('password')}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                                name="password"
                                placeholder="••••••"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                autoFocus
                                required
                                fullWidth
                                variant="outlined"
                            />
                        </FormControl>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            loading={signInMutation.isPending}
                            disabled={signInMutation.isPending}
                        >
                            {t('common.btn_continue')}
                        </Button>

                        <Stack
                            direction="row"
                            justifyContent="space-between"
                        >
                            <Link
                                component="button"
                                type="button"
                                onClick={() => forgotPasswordRef.current?.toggleOpen(true)}
                                variant="body2"
                                sx={{ alignSelf: 'center' }}
                            >
                                {t('view_auth.message_forgot_password')}
                            </Link>

                            <Link
                                component="button"
                                type="button"
                                onClick={() => resendVerifyCodeRef.current?.toggleOpen(true)}
                                variant="body2"
                                sx={{ alignSelf: 'center' }}
                            >
                                {t('view_auth.message_resend_verify_code')}
                            </Link>
                        </Stack>
                    </Box>

                    <Divider>{t('common.label_or')}</Divider>

                    {/* social login */}
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2, 
                        }}
                    >
                        {/* <Button
                            fullWidth
                            variant="outlined"
                            onClick={() => alert('Sign in with Google')}
                            startIcon={<GoogleIcon />}
                        >
                            Sign in with Google
                        </Button> */}
                        <Typography sx={{ textAlign: 'center' }}>
                            {t('view_auth.message_no_account')}
                            <NavLink to="/sign-up">
                                {t('view_auth.btn_to_sign_up')}
                            </NavLink>
                        </Typography>

                        <Typography sx={{ textAlign: 'center' }}>
                            {t('view_auth.message_go_verify_email')}
                            <NavLink to="/verify-email">
                                {t('view_auth.btn_to_verify_email')}
                            </NavLink>
                        </Typography>
                    </Box>
                </Card>
            </Container>

            <ForgotPassword
                ref={forgotPasswordRef}
            />

            <ResendVerifyCode
                ref={resendVerifyCodeRef}
            />
        </div>
    );
};
