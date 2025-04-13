import { useMemo } from 'react';

import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const account = useSelector((state: RootState) => state.auth.account);
    const accountRoles = useMemo(() => account?.roles ?? [], [account]);

    const accessibleRoutes = protectedRoutes.filter(route => {
        return !route.roles || route.roles.some((role) => accountRoles.some((r) => r.role === role));
    });

    const isSelected = (path: string) => {
        return location.pathname.startsWith(`/${path}`);
    }; 

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
                            selected={isSelected(route.path)}
                            onClick={() => navigate(`/${route.path}`)}
                        >
                            <ListItemIcon>
                                {route.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={t(`nav.${route.path}`)}
                                slotProps={{ primary: { fontWeight: isSelected(route.path) ? 'bold' : 'normal' } }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Stack>
    );
};