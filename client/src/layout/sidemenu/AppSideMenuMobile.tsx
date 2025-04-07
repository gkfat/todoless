import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import {
    Box,
    Button,
    Divider,
    Stack,
} from '@mui/material';
import Drawer, { drawerClasses } from '@mui/material/Drawer';

import { Account } from '../../types/account';
import { AvatarBlock } from './components/AvatarBlock';
import { MenuContent } from './components/MenuContent';

interface SideMenuMobileProps {
    account: Account;
    open: boolean | undefined;
    toggleDrawer: (open: boolean) => () => void;
  }
  
export const AppSideMenuMobile = ({
    account,
    open,
    toggleDrawer, 
}: SideMenuMobileProps) => {

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={toggleDrawer(false)}
            sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
                [`& .${drawerClasses.paper}`]: {
                    backgroundImage: 'none',
                    backgroundColor: 'background.paper',
                },
            }}
        >
            <Stack
                sx={{
                    maxWidth: '70dvw',
                    height: '100%',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        p: 2,
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
            </Stack>
        </Drawer>
    );
};
  