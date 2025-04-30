import {
    useEffect,
    useRef,
} from 'react';

import { Dayjs } from 'dayjs';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { yupResolver } from '@hookform/resolvers/yup';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import CheckIcon from '@mui/icons-material/Check';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import {
    Card,
    Checkbox,
    getContrastRatio,
    Grid,
    IconButton,
    Stack,
    TextField,
    Typography,
    useTheme,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';

import { TodoApi } from '../../../../api/todos';
import { Category } from '../../../../types/category';
import { Todo } from '../../../../types/todo';
import {
    DeleteTodoDialog,
    DeleteTodoDialogRef,
} from './components/DeleteTodoDialog';

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
            completedTodoMutation.mutate({ todoId: todo.id });
        } else {
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
                sx={{
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'all 0.3s ease',
                    p: 1,
                    border: '1px solid',
                    borderColor: theme.palette.grey[300],

                    '&:hover': {
                        backgroundColor: theme.palette.grey[100],
                        '& .action-icons': { visibility: 'visible' }, 
                    },
                }}
            >
                <Grid
                    container
                    spacing={1}
                    alignItems="center"
                >
                    <Grid size="auto">
                        <Checkbox
                            checked={todo.starred}
                            onChange={handleStarClick}
                            icon={<BookmarkBorderIcon />}
                            checkedIcon={<BookmarkIcon />}
                        />
                        
                        <Checkbox
                            checked={!!todo.completed_at}
                            onChange={handleCompletedClick}
                            icon={<RadioButtonUncheckedIcon />}
                            checkedIcon={<CheckCircleIcon />}
                            color="success"
                        />
                    </Grid>

                    <Grid size="grow">
                        {
                            !isEditing
                                ? (
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            wordBreak: 'break-all',
                                            transition: 'all 0.3s',
                                            color: todo.completed_at ? 'text.disabled': 'text.primary',
                                            textDecoration: todo.completed_at ? 'line-through' : 'none', 
                                        }}
                                    >
                                        {todo.title}
                                    </Typography>
                                )
                                : (
                                    <TextField
                                        {...register('todoTitle')}
                                        placeholder={'請輸入待辦事項'}
                                        fullWidth
                                        variant="outlined"
                                        error={!!errors.todoTitle}
                                        helperText={errors.todoTitle?.message}
                                        autoFocus
                                    />
                                )
                        }
                    </Grid>

                    <Grid size="auto">
                        {
                            !isEditing ? editable && (
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    className="action-icons"
                                    sx={{
                                        visibility: 'hidden',
                                        transition: 'all 0.3s',
                                    }}
                                >
                                    <IconButton
                                        onClick={() => setEditingTodoId(todo.id)}
                                    >
                                        <EditIcon />
                                    </IconButton>

                                    <IconButton
                                        onClick={handleDeleteClick}
                                    >
                                        <DeleteIcon color="error" />
                                    </IconButton>
                                </Stack>
                            ) : (
                                <Stack
                                    direction="row"
                                    spacing={1}
                                >
                                    <IconButton
                                        className="app-button"
                                        onClick={() => handleSubmit(onSubmit)()}
                                    >
                                        <CheckIcon color="success" />
                                    </IconButton>

                                    <IconButton
                                        className="app-button"
                                        onClick={() => setEditingTodoId(null)}
                                    >
                                        <CloseIcon color="error" />
                                    </IconButton>
                                </Stack>
                            )
                        }
                    </Grid>

                </Grid>

                {/* <CategoryChip
                        todo={todo}
                        categories={categories}
                        bgColor={bgColor}
                        textColor={textColor}
                        onCategoryChange={onCategoryChange}
                    /> */}
                {/* 
                    <DueDateChip
                        todo={todo}
                        onDueDateChange={onDueDateChange}
                    /> */}
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
