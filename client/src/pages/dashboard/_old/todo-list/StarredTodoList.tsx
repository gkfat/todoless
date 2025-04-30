import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useState,
} from 'react';

import { useSortable } from '@dnd-kit/sortable';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
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
} from '../../../../api/todos';
import { Category } from '../../../../types/category';
import { DashboardConfig } from '../../../../types/dashboard';
import { Todo } from '../../../../types/todo';
import { createDate } from '../../../../utils/time';
import { DashboardCard } from '../components/DashboardCard';
import { TodoItem } from './components/todo-item/TodoItem';

export interface StarredTodoListRef {
    onRefresh: () => void;
}

interface StarredTodoListProps {
    categories: Category[];
    dashboardConfig: DashboardConfig;
    dragListeners?: ReturnType<typeof useSortable>['listeners'];
    onDashboardConfigUpdate: (c: DashboardConfig) => void;
}

export const StarredTodoList = forwardRef<StarredTodoListRef, StarredTodoListProps>((props, ref) => {
    const {
        categories,
        dashboardConfig,
        dragListeners,
        onDashboardConfigUpdate, 
    } = props;
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

    const handleDisplayToggle = () => {
        const config = {
            ...dashboardConfig,
            display: !dashboardConfig.display,
        };

        onDashboardConfigUpdate(config);
    };

    return (
        <DashboardCard
            title="精選"
            icon={
                <IconButton
                    {...dragListeners}
                    className="drag-handle"
                    sx={{ cursor: 'grab' }}
                >
                    <DragIndicatorIcon />
                </IconButton>
            }
            collapsed={!dashboardConfig.display}
            onToggleCollapse={handleDisplayToggle}
            toolbar={
                <>
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
                </>
            }
        >
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
        </DashboardCard>
    );
});