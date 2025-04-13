import React, {
    Fragment,
    useState,
} from 'react';

import { useTranslation } from 'react-i18next';

import LanguageIcon from '@mui/icons-material/Language';
import {
    IconButton,
    Menu,
    MenuItem,
} from '@mui/material';

type Language = 'zh'|'en';

interface Item {
    title: string;
    value: Language;
}

const langItems: Item[] = [
    {
        title: '繁體中文',
        value: 'zh', 
    }, {
        title: 'English',
        value: 'en', 
    },
];

export const LanguageSelector = () => {
    const { i18n } = useTranslation();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const onLangChange = (lang: Language) => () => {
        i18n.changeLanguage(lang);
    };
    
    return (
        <Fragment>
            <IconButton
                onClick={handleClick}
                size="small"
                disableRipple
            >
                {<LanguageIcon />}
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
                {langItems.map((item) => (
                    <MenuItem
                        key={item.value}
                        selected={i18n.language === item.value}
                        onClick={onLangChange(item.value)}
                    >
                        {item.title}
                    </MenuItem>
                ))}
            </Menu>
        </Fragment>
    );
};