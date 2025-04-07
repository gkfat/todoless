import { JSX } from 'react';

import {
    useLocation,
    useNavigate,
} from 'react-router-dom';

import DashboardRoundIcon from '@mui/icons-material/DashboardRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import {
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Stack,
} from '@mui/material';

interface MenuItem {
    text: string;
    icon: JSX.Element;
    path: string;
}

const mainListItems: MenuItem[] = [
    {
        text: 'Dashboard', icon: <DashboardRoundIcon/>,  path: '/dashboard',
    },
];

const secondaryListItems: MenuItem[] = [
    {
        text: 'Settings', icon: <SettingsRoundedIcon/>, path: '/settings',
    },
];

export const MenuContent = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleItemClick = (path: string) => {
        navigate(path);
    };

    const renderMenuItems = (items: MenuItem[]) => (
        <List dense>
            {items.map((item, index) => (
                <ListItem key={index} disablePadding sx={{ display: 'block' }}>
                    <ListItemButton
                        selected={location.pathname === item.path}
                        onClick={() => handleItemClick(item.path)}
                    >
                        <ListItemIcon>
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    );

    return (
        <Stack
            sx={{
                p: 1,
                flexGrow: 1,
                justifyContent: 'space-between', 
            }}
        >
            {renderMenuItems(mainListItems)}
            {renderMenuItems(secondaryListItems)}
        </Stack>
    );
};