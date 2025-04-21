import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
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
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';

import { AuthApi } from '../../../api/auth';
import { LanguageSelector } from '../../../components/LanguageSelector';
import { Regex } from '../../../utils/regex';
import { Card } from '../components/Card';
import { Container } from '../components/Container';

type FormValues = {
    email: string;
    password: string;
    passwordConfirm: string;
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
    passwordConfirm: yup
        .string()
        .required('此為必填欄位')
        .test('password', 'Passwords do not match.', (value, ctx) => {
            return value && value === ctx.parent.password;
        }),
});

export const SignUpPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({ resolver: yupResolver(formSchema) });

    const signUpMutation = useMutation({
        mutationFn: AuthApi.signUp,
        onSuccess: () => {
            navigate('/sign-in');
        },
        onError: (error: any) => {
            console.error(error);
        },
    });

    const onSubmit = (data: FormValues) => {
        signUpMutation.mutate({
            email: data.email,
            password: data.password,
            name: data.email.split('@')[0],
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
                            {t('view_auth.title_sign_up')}
                        </Typography>
                    
                        <LanguageSelector />
                    </Stack>
                 
                    <Box
                        component="form"
                        onSubmit={handleSubmit(onSubmit)}
                        noValidate
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

                        <FormControl>
                            <FormLabel htmlFor="passwordConfirm">Confirm Password</FormLabel>
                            <TextField
                                {...register('passwordConfirm')}
                                error={!!errors.passwordConfirm}
                                helperText={errors.passwordConfirm?.message}
                                name="passwordConfirm"
                                placeholder="••••••"
                                type="password"
                                id="passwordConfirm"
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
                            loading={signUpMutation.isPending}
                            disabled={signUpMutation.isPending}
                        >
                            {t('common.btn_continue')}
                        </Button>
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
                            {t('view_auth.message_already_have_account')}
                            <NavLink to="/sign-in">
                                {t('view_auth.btn_to_sign_in')}
                            </NavLink>
                        </Typography>
                    </Box>
                </Card>
            </Container>
        </div>
    );
};
