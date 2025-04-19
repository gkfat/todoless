import {
    useEffect,
    useRef,
    useState,
} from 'react';

import { Dayjs } from 'dayjs';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { yupResolver } from '@hookform/resolvers/yup';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
    alpha,
    Card,
    CardContent,
    Chip,
    getContrastRatio,
    Grid,
    IconButton,
    Stack,
    TextField,
    Typography,
    useTheme,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';

import { TodoApi } from '../../../../../api/todos';
import { Category } from '../../../../../types/category';
import { Todo } from '../../../../../types/todo';
import { CategoryChip } from './components/CategoryChip';
import {
    DeleteTodoDialog,
    DeleteTodoDialogRef,
} from './components/DeleteTodoDialog';
import { DueDateChip } from './components/DueDateChip';
import { StarBox } from './components/StarBox';

const updateTodoFormSchema = yup.object({
    todoTitle: yup
        .string()
        .required('此為必填欄位')
        .max(150, '待辦事項不可超過 150 個字'),
});

interface TodoItemProps {
    todo: Todo;
    onUpdate: () => void;
    editingTodoId: number | null;
    setEditingTodoId: (id: number | null) => void;
    categories: Category[];
    editable?: boolean;
}

export const TodoItem = (props: TodoItemProps) => {
    const {
        todo,
        onUpdate,
        editingTodoId,
        setEditingTodoId,
        categories,
        editable = true,
    } = props;
    
    const theme = useTheme();
    const [completed, setCompleted] = useState(!!todo.completed_at);
    const bgColor = todo.category?.color ?? theme.palette.primary.main;
    const isBgDark = getContrastRatio(bgColor, '#fff') >= 4.5;
    const textColor = isBgDark ? theme.palette.common.white : theme.palette.common.black;

    const deleteTodoDialogRef = useRef<DeleteTodoDialogRef>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm({ resolver: yupResolver(updateTodoFormSchema) });

    const isEditing = editingTodoId === todo.id;
    
    const handleDeleteClick = () => {
        deleteTodoDialogRef.current?.setOpen(true);
    };
    
    const handleCancelDelete = () => {
        deleteTodoDialogRef.current?.setOpen(false);
    };

    useEffect(() => {
        if (isEditing) {
            setValue('todoTitle', todo.title);
        } else {
            reset();
        }
    }, [
        isEditing,
        todo,
        reset,
        setValue,
    ]);
    
    const updateTodoMutation = useMutation({
        mutationFn: TodoApi.update,
        onSuccess: () => {
            reset();
            setEditingTodoId(null);
            onUpdate();
        },
        onError: (error: any) => {
            console.error(error);
        },
    });
    
    const onSubmit = (data: {todoTitle: string}) => {
        updateTodoMutation.mutate({
            todoId: todo.id,
            categoryId: todo.category?.id ?? -1,
            title: data.todoTitle,
        });
    };

    const deleteTodoMutation = useMutation({
        mutationFn: TodoApi.delete,
        onSuccess: () => {
            onUpdate();
            deleteTodoDialogRef.current?.setOpen(false);
        },
        onError: (error: any) => {
            console.error(error);
        },
    });
    
    const handleConfirmDelete = () => {
        deleteTodoMutation.mutate(todo.id);
    };

    const completedTodoMutation = useMutation({
        mutationFn: TodoApi.completed,
        onSuccess: () => {
            onUpdate();
        },
        onError: (error: any) => {
            console.error(error);
        },
    });

    const unCompletedTodoMutation = useMutation({
        mutationFn: TodoApi.unCompleted,
        onSuccess: () => {
            onUpdate();
        },
        onError: (error: any) => {
            console.error(error);
        },
    });

    const handleStarClick = () => {
        const target = !todo.starred;

        updateTodoMutation.mutate({
            categoryId: todo.category?.id ?? -1,
            todoId: todo.id,
            starred: target,
        });
    };

    const handleCompletedClick = async () => {
        if (!todo.completed_at) {
            setCompleted(true);
            completedTodoMutation.mutate({ todoId: todo.id });
        } else {
            setCompleted(false);
            unCompletedTodoMutation.mutate({ todoId: todo.id });
        }
    };

    const onCategoryChange = (categoryId: number) => {
        updateTodoMutation.mutate({
            todoId: todo.id,
            categoryId: categoryId,
        });
    };

    const onDueDateChange = (date: Dayjs | null) => {
        updateTodoMutation.mutate({
            todoId: todo.id,
            dueDate: date ? date.toISOString() : null,
        });
    };

    return (
        <>
            <Card
                variant="outlined"
                sx={{
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'all 0.3s',

                    '&:hover': { backgroundColor: alpha(bgColor, 0.1) }, 
                }}
            >
                <StarBox
                    todo={todo}
                    bgColor={bgColor}
                    handleStarClick={handleStarClick}
                />

                <CardContent
                    sx={{
                        p: 1,
                        '&:last-child': { pb: 1 },
                        flex: 1,
                        pl: '50px',
                    }}
                >
                    <Stack
                        direction="row"
                        sx={{
                            mb: 1,
                            flex: 1,
                            justifyContent: 'space-between',
                        }}
                    >
                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                        >
                            <CategoryChip
                                todo={todo}
                                categories={categories}
                                bgColor={bgColor}
                                textColor={textColor}
                                onCategoryChange={onCategoryChange}
                            />

                            <DueDateChip
                                todo={todo}
                                onDueDateChange={onDueDateChange}
                            />
                        </Stack>

                        {/* 完成 */}
                        <Chip
                            size="small"
                            label={todo.completed_at ? '標示為未完成' : '標示為完成'}
                            color="success"
                            onClick={handleCompletedClick}
                        />
                    </Stack>

                    {/* content */}
                    {
                        !isEditing
                            ? <Grid
                                container
                                spacing={1}
                                alignItems="center"
                            >
                                <Grid sx={{ flex: 1 }}>
                                    <Stack
                                        direction="row"
                                        spacing={1}
                                    >
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                wordBreak: 'break-all',
                                                color: completed ? 'text.disabled': 'text.primary',
                                                transition: 'all 0.3s',
                                                textDecoration: completed ? 'line-through' : 'none', 
                                            }}
                                        >
                                            {todo.title}
                                        </Typography>
                                    </Stack>
                                </Grid>

                                {
                                    editable && <Grid
                                        justifyContent="end"
                                    >
                                        <Stack
                                            direction="row"
                                            spacing={1}
                                        >
                                            <IconButton
                                                onClick={() => setEditingTodoId(todo.id)}
                                                sx={{ p: 0 }}
                                            >
                                                <EditIcon />
                                            </IconButton>

                                            <IconButton
                                                onClick={handleDeleteClick}
                                                sx={{ p: 0 }}
                                            >
                                                <DeleteIcon color="error" />
                                            </IconButton>
                                        </Stack>
                                    </Grid>
                                }
                            </Grid>
                            : <form onSubmit={handleSubmit(onSubmit)}>
                                <Stack
                                    direction="row"
                                    spacing={1}
                                >
                                    <TextField
                                        {...register('todoTitle')}
                                        placeholder={'請輸入待辦事項'}
                                        fullWidth
                                        variant="outlined"
                                        error={!!errors.todoTitle}
                                        helperText={errors.todoTitle?.message}
                                        autoFocus
                                    />

                                    <IconButton
                                        type="submit"
                                    >
                                        <CheckIcon color="success" />
                                    </IconButton>

                                    <IconButton
                                        onClick={() => setEditingTodoId(null)}
                                    >
                                        <CloseIcon color="error" />
                                    </IconButton>
                                </Stack>
                            </form>
                    }
                    
                </CardContent>
            </Card>

            <DeleteTodoDialog
                ref={deleteTodoDialogRef}
                todo={todo}
                handleConfirmDelete={handleConfirmDelete}
                handleCancelDelete={handleCancelDelete}
            />
        </>
    );
};
