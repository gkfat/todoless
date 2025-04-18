import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useState,
} from 'react';

import FilterAltIcon from '@mui/icons-material/FilterAlt';
import RefreshIcon from '@mui/icons-material/Refresh';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import {
    CardContent,
    Icon,
    IconButton,
    MenuItem,
    Paper,
    Select,
    SelectChangeEvent,
    Stack,
    Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';

import {
    GetTodosRequest,
    TodoApi,
} from '../../../api/todos';
import { Category } from '../../../types/category';
import { Todo } from '../../../types/todo';
import { createDate } from '../../../utils/time';
import { Card } from '../components/Card';
import { TodoItem } from './components/todo-item/TodoItem';

export interface StarredTodoListRef {
    onRefresh: () => void;
}

interface StarredTodoListProps {
    categories: Category[];
}

export const StarredTodoList = forwardRef<StarredTodoListRef, StarredTodoListProps>((props, ref) => {
    const { categories } = props;
    const [selectedCategoryId, setSelectedCategoryId] = useState<number>(-1);
    const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
    const [todos, setTodos] = useState<Todo[]>([]);

    const {
        data,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ['todos', selectedCategoryId],
        queryFn: () => {
            const params: GetTodosRequest = {};
    
            if (selectedCategoryId >= 0) {
                params.categoryId = selectedCategoryId;
            }

            return TodoApi.list(params);
        },
        refetchOnMount: false,
    });

    useEffect(() => {
        setTodos(
            (data ?? [])
                .filter((todo) => !!todo.starred && todo.completed_at === null)
                .sort((a, b) => createDate(b.update_at).valueOf() - createDate(a.update_at).valueOf()),
        );

    }, [data]);

    const handleSelectCategoryChange = (e: SelectChangeEvent<{value: number}>) => {
        const id = e.target.value as number;

        setSelectedCategoryId(id);
        onRefresh();
    };

    useImperativeHandle(ref, () => ({ onRefresh }));

    const onRefresh = () => {
        refetch();
    };

    return (
        <Card
            variant="outlined"
            sx={{ width: '100%' }}
        >
            <CardContent>
                <Stack
                    direction="row"
                    sx={{
                        alignItems: 'center',
                        gap: 1,
                        mb: 2,
                    }}
                >
                    <Icon>
                        <SpaceDashboardIcon />
                    </Icon>

                    <Typography
                        variant="h5"
                        sx={{ mr: 'auto' }}
                    >
                        精選
                    </Typography>

                    <Icon>
                        <FilterAltIcon />
                    </Icon>
                    <Select
                        value={selectedCategoryId}
                        displayEmpty
                        sx={{ borderRadius: '15px' }}
                        onChange={handleSelectCategoryChange}
                    >
                        <MenuItem value={-1}>全部</MenuItem>
                        
                        {categories.map((c) => (
                            <MenuItem value={c.id}>{c.title}</MenuItem>
                        ))}
                    </Select>

                    <IconButton
                        onClick={onRefresh}
                    >
                        <RefreshIcon />
                    </IconButton>
                </Stack>
                    
                <Stack
                    direction="row"
                    flexWrap="wrap"
                    gap={1}
                    sx={{
                        maxHeight: '500px',
                        overflowY: 'scroll', 
                    }}
                >
                    {isLoading && (
                        <Typography>Loading...</Typography>
                    )}

                    {!isLoading && !todos?.length && (
                        <Typography>沒有待辦。</Typography>
                    )}

                    {todos.map((todo) => (
                        <Paper
                            key={todo.id}
                            sx={{ width: '100%' }}
                        >
                            <TodoItem
                                todo={todo}
                                categories={categories}
                                onUpdate={() => onRefresh()}
                                editingTodoId={editingTodoId}
                                setEditingTodoId={setEditingTodoId}
                            />
                        </Paper>
                    ))}
                </Stack>
            </CardContent>
        </Card>
    );
});