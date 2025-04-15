import React, {
    Fragment,
    useState,
} from 'react';

import { useTranslation } from 'react-i18next';

import DarkModeIcon from '@mui/icons-material/DarkModeRounded';
import LightModeIcon from '@mui/icons-material/LightModeRounded';
import {
    IconButton,
    Menu,
    MenuItem,
} from '@mui/material';

import { useThemeMode } from '../../../theme/ThemeModeContext';

type ThemeMode = 'light' | 'dark' | 'system';

const modes: ThemeMode[] = [
    'system',
    'light',
    'dark',
];

export const ThemeModeSelector = () => {
    const { t } = useTranslation();
    const {
        mode, setMode, 
    } = useThemeMode();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMode = (targetMode: ThemeMode) => () => {
        setMode(targetMode);
        handleClose();
    };

    const resolvedMode = (() => {
        if (mode === 'system') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return mode;
    })();

    const icon = {
        light: <LightModeIcon />,
        dark: <DarkModeIcon />,
    }[resolvedMode];
    
    return (
        <Fragment>
            <IconButton
                className="app-button"
                onClick={handleClick}
                disableRipple
                size="small"
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
                    horizontal: 'right',
                    vertical: 'top', 
                }}
                anchorOrigin={{
                    horizontal: 'right',
                    vertical: 'bottom', 
                }}
            >
                {modes.map((m, index) => (
                    <MenuItem
                        key={index}
                        selected={mode === m}
                        onClick={handleMode(m)}
                    >
                        {t(`theme.${m}`)}
                    </MenuItem>
                ))}
            </Menu>
        </Fragment>
    );
};