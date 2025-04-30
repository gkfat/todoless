import { useState } from 'react';

import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { yupResolver } from '@hookform/resolvers/yup';
import SubjectIcon from '@mui/icons-material/Subject';
import {
    FormControl,
    FormHelperText,
    IconButton,
    InputBase,
    Paper,
    SelectChangeEvent,
    useTheme,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';

import { TodoApi } from '../../../api/todos';
import { Category } from '../../../types/category';

const addTodoFormSchema = yup.object({
    todoTitle: yup
        .string()
        .max(150, '待辦事項不可超過 150 個字'),
});

interface AddTodoProps {
    categories: Category[];
    onRefresh: () => void;
}

export const AddTodo = (props: AddTodoProps) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const {
        categories,
        onRefresh, 
    } = props;

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
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

    const onSubmit = (data: {todoTitle?: string | undefined}) => {
        if (!data.todoTitle?.length) {
            return;
        }
        
        createTodoMutation.mutate({
            categoryId: selectedCategoryId,
            title: data.todoTitle,
        });
    };

    return (
        <FormControl 
            error={!!errors.todoTitle}
            sx={{ width: '100%' }}
            onSubmit={handleSubmit(onSubmit)}
        >
            <Paper
                sx={{
                    display: 'flex',
                    border: '1px solid',
                    py: 1,
                    borderColor: theme.palette.grey[300], 
                    backgroundColor: theme.palette.grey[200],
                }}
            >
                <IconButton>
                    <SubjectIcon sx={{ color: theme.palette.grey[500] }} />
                </IconButton>
 
                <InputBase
                    {...register('todoTitle')}
                    autoFocus
                    placeholder={'新增待辦'}
                    sx={{ flex: 1 }}
                />
            </Paper>

            {!!errors.todoTitle && (
                <FormHelperText>{errors.todoTitle.message}</FormHelperText>
            )}
        </FormControl>
    );
};