import {
    useEffect,
    useState,
} from 'react';

import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { yupResolver } from '@hookform/resolvers/yup';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import EventIcon from '@mui/icons-material/Event';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import {
    alpha,
    Box,
    Card,
    CardContent,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    getContrastRatio,
    Grid,
    Icon,
    IconButton,
    Stack,
    TextField,
    Typography,
    useTheme,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';

import { TodoApi } from '../../../api/todos';
import { Todo } from '../../../types/todo';
import { timeFormat } from '../../../utils/time';

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
}

export const TodoItem = (props: TodoItemProps) => {
    const {
        todo,
        onUpdate,
        editingTodoId,
        setEditingTodoId,
    } = props;
    
    const theme = useTheme();
    const bgColor = todo.category?.color ?? theme.palette.primary.main;
    const isBgDark = getContrastRatio(bgColor, '#fff') >= 4.5;
    const textColor = isBgDark ? theme.palette.common.white : theme.palette.common.black;

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm({ resolver: yupResolver(updateTodoFormSchema) });

    const isEditing = editingTodoId === todo.id;
    const [openConfirm, setOpenConfirm] = useState(false);
    
    const handleDeleteClick = () => {
        setOpenConfirm(true);
    };
    
    const handleCancelDelete = () => {
        setOpenConfirm(false);
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
            categoryId: todo.category?.id,
            title: data.todoTitle,
        });
    };

    const deleteTodoMutation = useMutation({
        mutationFn: TodoApi.delete,
        onSuccess: () => {
            // reset();
            onUpdate();
            setOpenConfirm(false);
        },
        onError: (error: any) => {
            console.error(error);
        },
    });
    
    const handleConfirmDelete = () => {
        deleteTodoMutation.mutate(todo.id);
    };

    const handleStarClick = () => {
        const target = !todo.starred;

        updateTodoMutation.mutate({
            todoId: todo.id,
            starred: target,
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
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        bottom: 0,
                        width: '40px',
                        backgroundColor: bgColor,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <IconButton
                        onClick={handleStarClick}
                        disableRipple
                        sx={{
                            backgroundColor: 'transparent',
                            '&:hover': { backgroundColor: 'transparent' }, 
                        }}
                    >
                        {
                            todo.starred
                                ? <StarIcon color="warning" />
                                : <StarBorderIcon />
                        }
                    </IconButton>
                </Box>

                <CardContent
                    sx={{
                        p: 1,
                        '&:last-child': { pb: 1 },
                        flex: 1,
                        pl: '50px',
                    }}
                >
                    {/* header */}
                    <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                            mb: 1,
                            flex: 1, 
                        }}
                    >
                        <Chip
                            size="small"
                            label={todo.category?.title ?? '未分類'}
                            sx={{
                                backgroundColor: bgColor,
                                color: textColor,
                            }}
                        />

                        <Stack
                            direction="row"
                            alignItems="center"
                        >
                            <Icon>
                                <EventIcon fontSize="small" />
                            </Icon>
                            <Typography>{todo.due_date ? timeFormat(todo.due_date) : '無期限'}</Typography>
                        </Stack>
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
                                            sx={{ wordBreak: 'break-all' }}
                                        >
                                            {todo.title}
                                        </Typography>
                                    </Stack>
                                </Grid>
                                <Grid
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

            <Dialog
                open={openConfirm}
                onClose={handleCancelDelete}
            >
                <DialogContent sx={{ p: 5 }}>
                    <Stack spacing={2}>
                        <Typography variant="h4">
                            確定刪除待辦？
                        </Typography>

                        <Typography
                            variant="h3"
                            fontWeight="bold"
                        >
                            {todo.title}
                        </Typography>
                    </Stack>
                </DialogContent>
                
                <DialogActions>
                    <IconButton
                        sx={{ borderRadius: '50%' }}
                        onClick={handleConfirmDelete}
                    >
                        <CheckIcon color="success" />
                    </IconButton>

                    <IconButton
                        sx={{ borderRadius: '50%' }}
                        onClick={handleCancelDelete}
                    >
                        <ClearIcon color="secondary" />
                    </IconButton>
                </DialogActions>
            </Dialog>
        </>
    );
};
