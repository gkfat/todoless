import { useState } from 'react';

import CheckIcon from '@mui/icons-material/Check';
import {
    Chip,
    Menu,
    Stack,
} from '@mui/material';

import { Category } from '../../../../../../../types/category';
import { Todo } from '../../../../../../../types/todo';

interface CategoryChipProps {
    todo: Todo;
    categories: Category[];
    bgColor: string;
    textColor: string;
    onCategoryChange: (categoryId: number) => void;
}

export const CategoryChip = (props: CategoryChipProps) => {
    const {
        todo,
        categories,
        bgColor,
        textColor,
        onCategoryChange,
    } = props;

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleChange = (categoryId: number) => {
        onCategoryChange(categoryId);
        handleClose();
    };

    return (
        <>
            <Chip
                size="small"
                label={todo.category?.title ?? '未分類'}
                sx={{
                    backgroundColor: bgColor,
                    color: textColor,
                }}
                onClick={handleOpen}
            />

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                        px:2,
                        py:1, 
                    }}
                >
                    <Chip
                        size="small"
                        label="未分類" 
                        onClick={() => handleChange(-1)}
                        icon={!todo.category?.id ? <CheckIcon fontSize="small" /> : undefined}
                    />
                    
                    {
                        (categories ?? []).map((c) => (
                            <Chip
                                key={c.id}
                                size="small"
                                label={c.title}
                                icon={todo.category?.id === c.id ? <CheckIcon fontSize="small" /> : undefined}
                                onClick={() => handleChange(c.id)}
                            />
                        ))
                    }
                </Stack>
            </Menu>
           
        </>
    );
};