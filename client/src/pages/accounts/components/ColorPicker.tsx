import {
    MouseEvent,
    useState,
} from 'react';

import { TwitterPicker } from 'react-color';

import {
    Box,
    ClickAwayListener,
    Popper,
} from '@mui/material';

interface ColorPickerProps {
    color: string;
    onChange: (color: string) => void;
}

export const ColorPicker = ({
    color,
    onChange, 
}: ColorPickerProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [instantColor, setInstantColor] = useState(color);

    const handleClick = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const handleChangeComplete = (newColor: any) => {
        setInstantColor(newColor.hex);
    };
    
    const handleClose = () => {
        setAnchorEl(null);
        onChange(instantColor);
    };

    return (
        <>
            <Box
                onClick={handleClick}
                sx={{
                    width: 20,
                    height: 20,
                    borderRadius: '4px',
                    backgroundColor: instantColor,
                    cursor: 'pointer',
                }}
            />

            <Popper
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                placement="bottom-start"
            >
                <ClickAwayListener onClickAway={handleClose}>
                    <Box sx={{ transform: 'translateY(20px)' }}>
                        <TwitterPicker
                            color={instantColor}
                            onChangeComplete={handleChangeComplete}
                        />
                    </Box>
                </ClickAwayListener>
            </Popper>
        </>
    );
};