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
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';

import { AuthApi } from '../../../api/auth';
import { showNotification } from '../../../store/notificationSlice';
import { Regex } from '../../../utils/regex';
import { Card } from '../components/Card';
import { Container } from '../components/Container';

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

export const VerifyEmailPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({ resolver: yupResolver(formSchema) });

    const verifyEmailMutation = useMutation({
        mutationFn: AuthApi.verifyCode,
        onSuccess: () => {
            dispatch(showNotification({
                message: t('view_auth.message_email_verified_successfully'),
                type: 'success',
            }));

            navigate('/sign-in');
        },
        onError: (error: any) => {
            console.error(error);
        },
    });

    const trigger = () => {
        dispatch(showNotification({
            message: '操作成功',
            type: 'success', 
        }));
    };

    const onSubmit = (data: FormValues) => {
 
        verifyEmailMutation.mutate({
            email: data.email,
            verificationCode: data.verificationCode,
        });
    };

    return (
        <>
            <CssBaseline enableColorScheme />
   
            <Container
                direction="column"
                justifyContent="space-between"
            >
                <Card
                    variant="outlined"
                    sx={{ backgroundColor: 'white' }}
                >
   
                    <Button onClick={() => trigger()}>type</Button>
                    <Stack direction="row">
                        <Typography
                            component="h1"
                            variant="h4"
                            sx={{ width: '100%' }}
                        >
                            {t('view_auth.title_verify_email')}
                        </Typography>
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
                        <Typography>
                            {t('view_auth.message_verify_email_description')}
                        </Typography>

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
                            <FormLabel>Verification Code</FormLabel>
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
                        </FormControl>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            loading={verifyEmailMutation.isPending}
                            disabled={verifyEmailMutation.isPending}
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
                            {t('view_auth.message_already_verify_email')}
                            <NavLink to="/sign-in">
                                {t('view_auth.btn_to_sign_in')}
                            </NavLink>
                        </Typography>
                    </Box>
                </Card>
            </Container>
        </>
    );
};