import {
    FormEvent,
    useState,
} from 'react';

import { useDispatch } from 'react-redux';
import {
    NavLink,
    useNavigate,
} from 'react-router-dom';

import {
    Box,
    Button,
    CssBaseline,
    Divider,
    FormControl,
    FormLabel,
    Link,
    TextField,
    Typography,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';

import { AuthApi } from '../../../api/auth';
import { Card } from '../../../components/Card';
import { login } from '../../../store/authSlice';
import { Regex } from '../../../utils/regex';
import { Container } from '../components/Container';
import ForgotPassword from '../components/ForgotPassword';

export const SignInPage = ()=> {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };
    
    const handleClose = () => {
        setOpen(false);
    };

    const validateInputs = () => {
        let isValid = true;

        if (!email || !Regex.email.test(email)) {
            setEmailError(true);
            setEmailErrorMessage('Please enter a valid email address.');
            isValid = false;
        } else {
            setEmailError(false);
            setEmailErrorMessage('');
        }
    
        if (!password || !Regex.password.test(password)) {
            setPasswordError(true);
            setPasswordErrorMessage('Password must be contains at least 1 character and 1 digit, between 6 ~ 10 long.');
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }
    
        return isValid;
    };

    const signInMutation = useMutation({
        mutationFn: AuthApi.signIn,
        onSuccess: (response) => {
            const { token } = response;
            dispatch(login(token));
            navigate('/dashboard');
        },
        onError: (error: any) => {
            console.error(error);
        },
    });

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!validateInputs()) {
            return;
        }
       
        signInMutation.mutate({
            type: 'password',
            email,
            password,
        });
    };

    return (
        <div>
            <CssBaseline />

            <Container direction="column" justifyContent="space-between">
                <Card variant="outlined" sx={{ backgroundColor: 'white' }}>
                    <Typography
                        component="h1"
                        variant="h4"
                        sx={{ width: '100%' }}
                    >
                        Sign In
                    </Typography>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
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
                                error={emailError}
                                helperText={emailErrorMessage}
                                id="email"
                                placeholder="your@email.com"
                                autoComplete="email"
                                required
                                fullWidth
                                variant="outlined"
                                color={emailError ? 'error': 'primary'}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel htmlFor="password">Password</FormLabel>
                            <TextField
                                error={passwordError}
                                helperText={passwordErrorMessage}
                                name="password"
                                placeholder="••••••"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                autoFocus
                                required
                                fullWidth
                                variant="outlined"
                                color={passwordError ? 'error' : 'primary'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </FormControl>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={signInMutation.isPending}
                        >
                            {signInMutation.isPending ? 'Signing In...' : 'Sign In'}
                        </Button>
                        <Link
                            component="button"
                            type="button"
                            onClick={handleClickOpen}
                            variant="body2"
                            sx={{ alignSelf: 'center' }}
                        >
                            Forgot your password?
                        </Link>
                    </Box>

                    <Divider>or</Divider>

                    {/* social login */}
                    <Box sx={{
                        display: 'flex', flexDirection: 'column', gap: 2, 
                    }}>
                        {/* <Button
                            fullWidth
                            variant="outlined"
                            onClick={() => alert('Sign in with Google')}
                            startIcon={<GoogleIcon />}
                        >
                            Sign in with Google
                        </Button> */}
                        <Typography sx={{ textAlign: 'center' }}>
                            Don&apos;t have an account?{' '}
                            <NavLink to="/sign-up">
                                Sign up
                            </NavLink>
                        </Typography>
                    </Box>
                </Card>
            </Container>

            <ForgotPassword open={open} handleClose={handleClose} />
        </div>
    );
};
