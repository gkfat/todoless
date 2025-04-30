import { useState } from 'react';

import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { yupResolver } from '@hookform/resolvers/yup';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import {
    IconButton,
    InputAdornment,
    MenuItem,
    Paper,
    Select,
    SelectChangeEvent,
    Stack,
    TextField,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';

import { TodoApi } from '../../../../../api/todos';
import { Category } from '../../../../../types/category';

const addTodoFormSchema = yup.object({
    todoTitle: yup
        .string()
        .required('此為必填欄位')
        .max(150, '待辦事項不可超過 150 個字'),
});

interface AddTodoProps {
    categories: Category[];
    onRefresh: () => void;
}

export const AddTodo = (props: AddTodoProps) => {
    const { t } = useTranslation();
    const {
        categories,
        onRefresh, 
    } = props;

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        resetField,
    } = useForm({ resolver: yupResolver(addTodoFormSchema) });

    const [selectedCategoryId, setSelectedCategoryId] = useState<number>(-1);

    const handleSelectCategoryChange = (e: SelectChangeEvent<{value: number}>) => {
        const id = e.target.value as number;
 
        setSelectedCategoryId(id);
    };

    const createTodoMutation = useMutation({
        mutationFn: TodoApi.create,
        onSuccess: () => {
            reset();
            onRefresh();
        },
        onError: (error: any) => {
            console.error(error);
        },
    });

    const onSubmit = (data: {todoTitle: string}) => {
        createTodoMutation.mutate({
            categoryId: selectedCategoryId,
            title: data.todoTitle,
        });
    };

    return (
        <Paper
            sx={{ width: '100%' }}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack
                    direction="row"
                    spacing={1}
                    alignItems="start"
                >
                    <Select
                        value={selectedCategoryId}
                        displayEmpty
                        onChange={handleSelectCategoryChange}
                    >
                        <MenuItem value={-1}>未分類</MenuItem>
                        
                        {categories.map((c) => (
                            <MenuItem value={c.id}>{c.title}</MenuItem>
                        ))}
                    </Select>

                    <TextField
                        {...register('todoTitle')}
                        placeholder={'今天做什麼好呢？'}
                        fullWidth
                        variant="outlined"
                        error={!!errors.todoTitle}
                        helperText={errors.todoTitle?.message}
                        autoFocus
                        slotProps={{
                            input: {
                                endAdornment:  <InputAdornment position="end">
                                    <IconButton
                                        size="small"
                                        onClick={() => resetField('todoTitle')}
                                    >
                                        <ClearIcon />
                                    </IconButton>
                                </InputAdornment>,
                            },
                        }}
                    />
                    
                    <IconButton
                        type="submit"
                        sx={{ borderRadius: '50%' }}
                    >
                        <CheckIcon color="success" />
                    </IconButton>
                </Stack>
            </form>
        </Paper>
    );
};