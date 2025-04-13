import { useEffect } from 'react';

import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';

import {
    alpha,
    Box,
    CssBaseline,
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

    useEffect(() => {
        if (account) {
            dispatch(setAccount(account));
        }
    }, [account, dispatch]);
    
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
                    paddingTop: '65px',
                    height: '100vh',
                    [theme.breakpoints.up('md')]: { marginLeft: '183px' },
                })}
            >
                <Outlet />
            </Box>
        </div>
    );
};