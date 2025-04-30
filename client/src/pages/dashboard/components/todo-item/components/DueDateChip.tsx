import {
    MouseEvent,
    useRef,
} from 'react';

import { Dayjs } from 'dayjs';

import EventNoteIcon from '@mui/icons-material/EventNote';
import { Chip } from '@mui/material';

import {
    AppDatePicker,
    AppDatePickerRef,
} from '../../../../../components/AppDatePicker';
import { Todo } from '../../../../../types/todo';
import { timeFormat } from '../../../../../utils/time';

interface DueDateChipProps {
    todo: Todo;
    onDueDateChange: (d: Dayjs | null) => void;
}

export const DueDateChip = (props: DueDateChipProps) => {
    const datePickerRef = useRef<AppDatePickerRef>(null);
    
    const {
        todo, onDueDateChange, 
    } = props;

    const handleClick = (e: MouseEvent<HTMLDivElement>) => {
        datePickerRef.current?.setOpen(e.currentTarget);
    };

    return (
        <>
            <Chip
                size="small"
                variant="outlined"
                label={todo.due_date ? timeFormat(todo.due_date, 'MM/DD') : '無期限'}
                icon={<EventNoteIcon fontSize="small" />}
                sx={{ px: 1 }}
                onClick={handleClick}
            />

            <AppDatePicker
                ref={datePickerRef}
                date={todo.due_date}
                onDateChange={onDueDateChange}
            />
        </>
    );
};