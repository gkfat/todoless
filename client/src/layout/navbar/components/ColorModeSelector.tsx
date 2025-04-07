import React, {
    Fragment,
    useState,
} from 'react';

import DarkModeIcon from '@mui/icons-material/DarkModeRounded';
import LightModeIcon from '@mui/icons-material/LightModeRounded';
import {
    IconButton,
    Menu,
    MenuItem,
    useColorScheme,
} from '@mui/material';

export const ColorModeSelector = () => {
    const {
        mode, systemMode, setMode, 
    } = useColorScheme();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMode = (targetMode: 'system' | 'light' | 'dark') => () => {
        setMode(targetMode);
        handleClose();
    };

    const resolvedMode = (systemMode || mode) as 'light' | 'dark';
    const icon = {
        light: <LightModeIcon />,
        dark: <DarkModeIcon />,
    }[resolvedMode];
    
    return (
        <Fragment>
            <IconButton
                data-screenshot="toggle-mode"
                onClick={handleClick}
                disableRipple
                size="small"
                aria-controls={open ? 'color-scheme-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
            >
                {icon}
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                slotProps={{
                    paper: {
                        variant: 'outlined',
                        elevation: 0,
                        sx: { my: '4px' },
                    },
                }}
                transformOrigin={{
                    horizontal: 'right', vertical: 'top', 
                }}
                anchorOrigin={{
                    horizontal: 'right', vertical: 'bottom', 
                }}
            >
                <MenuItem selected={mode === 'system'} onClick={handleMode('system')}>
                    System
                </MenuItem>
                <MenuItem selected={mode === 'light'} onClick={handleMode('light')}>
                    Light
                </MenuItem>
                <MenuItem selected={mode === 'dark'} onClick={handleMode('dark')}>
                    Dark
                </MenuItem>
            </Menu>
        </Fragment>
    );
};