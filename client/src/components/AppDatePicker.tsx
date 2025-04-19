import {
    forwardRef,
    useImperativeHandle,
    useState,
} from 'react';

import { Dayjs } from 'dayjs';

import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import {
    Box,
    Button,
    Card,
    CardContent,
    ClickAwayListener,
    IconButton,
    Popper,
    Stack,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';

import { createDate } from '../utils/time';

export interface AppDatePickerRef {
    setOpen: (target: HTMLElement | null) => void;
}

interface AppDatePickerProps {
    date?: string;
    onDateChange: (d: Dayjs | null) => void;
}

export const AppDatePicker = forwardRef<AppDatePickerRef, AppDatePickerProps>((props, ref) => {
    const {
        date,
        onDateChange,
    } = props;
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const open = Boolean(anchorEl);
    const [selectedDate, setSelectedDate] = useState(date ? createDate(date) : null);

    const setOpen = (el: HTMLElement | null) => {
        setAnchorEl(el);
    };

    useImperativeHandle(ref, () => ({ setOpen }));

    const handleDateChange = (value: Dayjs | null) => {
        if (value === null) {
            setSelectedDate(null);
        }
        
        setOpen(null);
        onDateChange(value);
    };

    const handleCancel = () => {
        setOpen(null);
    };

    return (
        <Popper
            open={open}
            anchorEl={anchorEl}
            placement="bottom-start"
            sx={{ zIndex: 1300 }}
        >
            <ClickAwayListener onClickAway={() => setOpen(null)}>
                <Card variant="outlined">
                    <CardContent sx={{ p: 0 }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Box>
                                <StaticDatePicker
                                    value={selectedDate}
                                    onChange={setSelectedDate}
                                    sx={{ height: 'auto' }}
                                    slotProps={{
                                        actionBar: { sx: { display: 'none' } },
                                        toolbar: { sx: { display: 'none' } },
                                        calendar: { sx: { height: 'auto' } }, 
                                    }}
                                />
                            </Box>

                            <Stack
                                direction="row"
                                justifyContent="space-between"
                                spacing={1}
                                sx={{ px: 1 }}
                            >
                                <Button
                                    variant="text"
                                    color="error"
                                    sx={{ mr: 'auto' }}
                                    onClick={() => handleDateChange(null)}
                                >
                                    清除
                                </Button>

                                <Stack
                                    direction="row"
                                    spacing={1}
                                >
                                    <IconButton
                                        sx={{ borderRadius: '50%' }}
                                        onClick={handleCancel}
                                    >
                                        <ClearIcon />
                                    </IconButton>
                                    <IconButton
                                        sx={{ borderRadius: '50%' }}
                                        onClick={() => handleDateChange(selectedDate)}
                                    >
                                        <CheckIcon color="success" />
                                    </IconButton>
                                </Stack>
                            </Stack>
                        </LocalizationProvider>
                    </CardContent>
                </Card>
            </ClickAwayListener>
        </Popper>
    );
});