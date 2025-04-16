import {
    useEffect,
    useState,
} from 'react';

import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { yupResolver } from '@hookform/resolvers/yup';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import {
    Button,
    CardContent,
    Chip,
    IconButton,
    InputAdornment,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import {
    useMutation,
    useQuery,
} from '@tanstack/react-query';

import { CategoryApi } from '../../../../api/categories';
import { TodoApi } from '../../../../api/todos';
import { Card } from '../../components/Card';

const addTodoFormSchema = yup.object({
    todoTitle: yup
        .string()
        .required('此為必填欄位')
        .max(150, '待辦事項不可超過 150 個字'),
});

export const AddTodo = ({ onRefresh } : { onRefresh: () => void}) => {
    const { t } = useTranslation();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        resetField,
    } = useForm({ resolver: yupResolver(addTodoFormSchema) });

    const [categoryId, setCategoryId] = useState<number>();
        
    const { data: categories } = useQuery({
        queryKey: ['categories', 'list'],
        queryFn: CategoryApi.list,
        refetchOnMount: true,
    });

    useEffect(() => {
        if (categories && categories.length > 0) {
            setCategoryId(categories[0].id);
        }
    }, [categories]);

    const onCategorySelect = (categoryId: number) => () => {
        setCategoryId(categoryId);
    };

    const createTodoMutation = useMutation({
        mutationFn: TodoApi.create,
        onSuccess: () => {
            // TODO: notification
            reset();
            onRefresh();
        },
        onError: (error: any) => {
            console.error(error);
        },
    });

    const onSubmit = (data: {todoTitle: string}) => {
        if (!categoryId) {
            return;
        }

        createTodoMutation.mutate({
            categoryId,
            title: data.todoTitle,
        });
    };

    return (
        <>
            <Card variant="outlined">
                <CardContent>
                    <Typography
                        variant="h5"
                        sx={{ mb: 1 }}
                    >
                        {t('view_dashboard_add_todo.title')}
                    </Typography>

                    <Stack
                        direction="row"
                        sx={{
                            gap: 1,
                            mb: 2, 
                        }}
                    >
                        {
                            (categories ?? []).map((category) => {
                                const isSelected = category.id === categoryId;

                                return (
                                    <Chip
                                        key={category.id}
                                        label={category.title}
                                        icon={isSelected ? <CheckIcon color="success" /> : undefined}
                                        onClick={onCategorySelect(category.id)}
                                        variant={isSelected ? 'filled' : 'outlined'}
                                        sx={{
                                            backgroundColor: isSelected ? category.color ?? 'default' : 'default',
                                            borderColor: category.color,
                                        }}
                                    />
                                );
                            })
                        }
                    </Stack>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Stack
                            direction="row"
                            sx={{ mb: 2 }}
                        >
                            <TextField
                                {...register('todoTitle')}
                                placeholder={t('view_dashboard_add_todo.placeholder_add_todo')}
                                fullWidth
                                variant="outlined"
                                error={!!errors.todoTitle}
                                helperText={errors.todoTitle?.message}
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
                        </Stack>

                        <Stack
                            direction="row"
                            sx={{ justifyContent: 'flex-end' }}
                        >
                            <Button
                                type="submit"
                                variant="contained"
                            >
                                {t('common.btn_add')}
                            </Button>
                        </Stack>
                    </form>

                </CardContent>
            </Card>
        </>
    );
};