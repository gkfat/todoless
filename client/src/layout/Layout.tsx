import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';

import {
    alpha,
    Box,
    CssBaseline,
    Stack,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';

import { AccountApi } from '../api/accounts';
import { setAccount } from '../store/authSlice';
import { AppNavbar } from './navbar/AppNavbar';

export const Layout = () => {
    const dispatch = useDispatch();

    const { data: account } = useQuery({
        queryKey: ['account', 'me'],
        queryFn: AccountApi.me,
    });

    if (account) {
        dispatch(setAccount(account));
    }
    
    return (
        <div>
            <CssBaseline enableColorScheme />
            <AppNavbar account={account!} />

            <Box
                component="main"
                sx={(theme) => ({
                    flexGrow: 1,
                    backgroundColor: theme.vars
                        ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
                        : alpha(theme.palette.background.default, 1),
                    overflow: 'auto',
                    px: 2,
                    pt: 2,
                })}
            >
                <Stack spacing={2}>
                    <Outlet />
                </Stack>
            </Box>
        </div>
    );
};