import { Outlet } from 'react-router-dom';

import {
    alpha,
    Box,
    CssBaseline,
    Stack,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';

import { AccountApi } from '../api/accounts';
import { AppNavbar } from './navbar/AppNavbar';
import { AppSideMenu } from './sidemenu/AppSideMenu';

export const Layout = () => {
    const { data: account } = useQuery({
        queryKey: ['account', 'me'], // 唯一鍵，用於快取
        queryFn: AccountApi.me, // 獲取資料的函數
    });
    
    return (
        <div>
            <CssBaseline enableColorScheme />
            
            <AppNavbar account={account!} />

            <AppSideMenu account={account!} />

            <Box
                component="main"
                sx={(theme) => ({
                    flexGrow: 1,
                    backgroundColor: theme.vars
                        ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
                        : alpha(theme.palette.background.default, 1),
                    overflow: 'auto',
                })}
            >
                <Stack
                    spacing={2}
                    sx={{
                        alignItems: 'center',
                        mx: 3,
                        pb: 5,
                        mt: {
                            xs: 8,
                            md: 0,
                        },
                    }}
                >
                    <Outlet />
                </Stack>
            </Box>
        </div>
    );
};