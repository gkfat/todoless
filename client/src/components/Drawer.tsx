import { styled } from '@mui/material';
import MuiDrawer, { drawerClasses } from '@mui/material/Drawer';

interface DrawerProps {
    drawerWidth: number | string;
}

export const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'drawerWidth' })<DrawerProps>(({ drawerWidth }) => ({
    width: drawerWidth,
    flexShrink: 0,
    boxSizing: 'border-box',
    mt: 10,
    [`& .${drawerClasses.paper}`]: {
        width: drawerWidth,
        boxSizing: 'border-box',
    },
}));