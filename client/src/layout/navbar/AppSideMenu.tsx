import {
    Divider,
    Stack,
    SwipeableDrawer,
    Toolbar,
} from '@mui/material';

import { Drawer } from '../../components/Drawer';
import { Account } from '../../types/account';
import { AvatarBlock } from './components/AvatarBlock';
import { LogoutButton } from './components/LogoutButton';
import { MenuContent } from './components/MenuContent';

interface AppSideMenuProps {
    account: Account;
    open: boolean | undefined;
    isMobile: boolean;
    toggleDrawer: (open: boolean) => () => void;
}

export const AppSideMenu = ({
    account, isMobile, open, toggleDrawer, 
}: AppSideMenuProps) => {
    const drawerContent = (
        <Stack
            sx={{ height: '100%' }}
        >
            {!isMobile && <Toolbar/>}
            <Stack sx={{ flexGrow: 1 }}>
                <MenuContent />
            </Stack>

            <Divider />

            <Stack sx={{ p: 1.5 }}>
                <AvatarBlock account={account} />
            </Stack>

            <Divider />

            <Stack sx={{ p: 1 }}>
                <LogoutButton />
            </Stack>
        </Stack>
    );

    return isMobile ? (
        <SwipeableDrawer
            anchor="right"
            open={open}
            onClose={toggleDrawer(false)}
            onOpen={toggleDrawer(true)}
            sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
                '& .MuiDrawer-paper': {
                    maxWidth: '70dvw',
                    backgroundImage: 'none',
                    backgroundColor: 'background.paper',
                },
            }}
        >
            {drawerContent}
        </SwipeableDrawer>
    ) : (
        <Drawer
            variant="permanent"
            drawerWidth="auto"
            sx={{
                flexShrink: 0,
                display: {
                    xs: 'none',
                    md: 'block',
                },
                '& .MuiDrawer-paper': {
                    boxSizing: 'border-box',
                    backgroundColor: 'background.paper',
                },
            }}
        >
            {drawerContent}
        </Drawer>
    );
};