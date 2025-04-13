import { useMemo } from 'react';

import { useSelector } from 'react-redux';
import {
    useLocation,
    useNavigate,
} from 'react-router-dom';

import {
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Stack,
} from '@mui/material';

import { protectedRoutes } from '../../../routes/routesConfig';
import { RootState } from '../../../store';

export const MenuContent = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const account = useSelector((state: RootState) => state.auth.account);
    const accountRoles = useMemo(() => account?.roles ?? [], [account]);

    const accessibleRoutes = protectedRoutes.filter(route => {
        return !route.roles || route.roles.some((role) => accountRoles.some((r) => r.role === role));
    });

    return (
        <Stack
            sx={{
                flexGrow: 1,
                justifyContent: 'space-between', 
            }}
        >
            <List dense>
                {accessibleRoutes.map((route, index) => (
                    <ListItem key={index} disablePadding>
                        <ListItemButton
                            selected={location.pathname.startsWith(`/${route.path}`)}
                            onClick={() => navigate(`/${route.path}`)}
                        >
                            <ListItemIcon>{route.icon}</ListItemIcon>
                            <ListItemText primary={route.name} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Stack>
    );
};