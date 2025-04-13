import { useState } from 'react';

import {
    AppBar,
    Stack,
    styled,
    tabsClasses,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import MuiToolbar from '@mui/material/Toolbar';

import { LanguageSelector } from '../../components/LanguageSelector';
import { Account } from '../../types/account';
import { AppSideMenu } from './AppSideMenu';
import { AppLogo } from './components/AppLogo';
import { MenuButton } from './components/MenuButton';
import { ThemeModeSelector } from './components/ThemeModeSelector';

const Toolbar = styled(MuiToolbar)({
    width: '100%',
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
    justifyContent: 'center',
    gap: '12px',
    flexShrink: 0,
    [`& ${tabsClasses.flexContainer}`]: {
        gap: '8px',
        p: '8px',
        pb: 0,
    },
});
  
export const AppNavbar = ({ account }: {account: Account}) => {
    const [isOpen, setOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const toggleDrawer = (open: boolean) => () => {
        setOpen(open);
    };

    return (
        <>
            <AppBar
                component="nav"
                position="fixed"
                elevation={0}
                sx={{
                    bgcolor: 'background.paper',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
            >
                <Toolbar>
                    <Stack
                        direction="row"
                        sx={{
                            gap: 1,
                            width: '100%',
                            justifyContent: 'space-between',
                        }}
                    >
                        <AppLogo />

                        <Stack
                            direction="row"
                            sx={{ gap: 1 }}
                        >
                            <LanguageSelector />
                            <ThemeModeSelector />

                            {isMobile && <MenuButton onClick={toggleDrawer(true)} />}
                        </Stack>
                    </Stack>
                </Toolbar>
            </AppBar>

            <AppSideMenu
                account={account}
                isMobile={isMobile}
                open={isOpen}
                toggleDrawer={toggleDrawer}
            />
        </>
    );
};