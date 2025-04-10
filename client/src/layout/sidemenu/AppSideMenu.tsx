import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import {
    Box,
    Button,
    Divider,
    drawerClasses,
    Stack,
} from '@mui/material';

import { Drawer } from '../../components/Drawer';
import { Account } from '../../types/account';
import { AvatarBlock } from './components/AvatarBlock';
import { MenuContent } from './components/MenuContent';

export const AppSideMenu = ({ account }: {account: Account}) => {
    return (
        <Drawer
            variant="permanent"
            drawerWidth={240}
            sx={{
                display: {
                    xs: 'none', md: 'block', 
                },
                [`& .${drawerClasses.paper}`]: { backgroundColor: 'background.paper' },
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    p: 1.5,
                }}
            >
                <AvatarBlock account={account} />
            </Box>

            <Divider />

            <Stack sx={{ flexGrow: 1 }}>
                <MenuContent />
            </Stack>

            <Divider />

            <Box sx={{ p: 2 }}>
                <Button variant="outlined" fullWidth startIcon={<LogoutRoundedIcon />}>
                    Logout
                </Button>
            </Box>
        </Drawer>
    );
};