import { useState } from 'react';

import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import {
    AppBar,
    Stack,
    styled,
    tabsClasses,
    Typography,
} from '@mui/material';
import MuiToolbar from '@mui/material/Toolbar';

import { Account } from '../../types/account';
import { AppSideMenuMobile } from '../sidemenu/AppSideMenuMobile';
import { ColorModeSelector } from './components/ColorModeSelector';
import { MenuButton } from './components/MenuButton';

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

    const toggleDrawer = (open: boolean) => () => {
        setOpen(open);
    };

    return (
        <AppBar
            position="fixed"
            sx={{
                display: {
                    xs: 'auto', md: 'none', 
                },
                boxShadow: 0,
                bgcolor: 'background.paper',
                backgroundImage: 'none',
                borderBottom: '1px solid',
                borderColor: 'divider',
                top: 'var(--template-frame-height, 0px)',
            }}
        >
            <Toolbar variant="regular">
                <Stack
                    direction="row"
                    sx={{
                        alignItems: 'center',
                        flexGrow: 1,
                        width: '100%',
                        gap: 1,
                    }}
                >
                    <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                            justifyContent: 'center',
                            mr: 'auto',
                        }}
                    >
                        <Typography
                            variant="h4"
                            component="h1"
                            sx={{ color: 'text.primary' }}
                        >
                            TodoLess
                        </Typography>
                    </Stack>

                    <ColorModeSelector />
                    
                    <MenuButton
                        aria-label="menu"
                        onClick={toggleDrawer(true)}
                    >
                        <MenuRoundedIcon />
                    </MenuButton>
                    
                    <AppSideMenuMobile
                        open={isOpen}
                        account={account}
                        toggleDrawer={toggleDrawer}
                    />
                </Stack>
            </Toolbar>
        </AppBar>
    );
};