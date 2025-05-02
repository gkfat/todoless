import {
    useEffect,
    useState,
} from 'react';

import { useTranslation } from 'react-i18next';
import {
    useDispatch,
    useSelector,
} from 'react-redux';

import SwapVertIcon from '@mui/icons-material/SwapVert';
import {
    IconButton,
    MenuItem,
    Select,
    SelectChangeEvent,
    Stack,
    Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';

import { CategoryApi } from '../../api/categories';
import {
    GetTodosRequest,
    TodoApi,
} from '../../api/todos';
import { ControlPanel } from '../../components/ControlPanel';
import { PageContainer } from '../../components/PageContainer';
import { RootState } from '../../store';
import { Todo } from '../../types/todo';
import { createDate } from '../../utils/time';
import { AddTodo } from './components/AddTodo';
import { TodoItem } from './components/todo-item/TodoItem';

export const DashboardPage = () => {
    const { t } = useTranslation();

    const account = useSelector((state: RootState) => state.auth.account);
    const dispatch = useDispatch();

    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
    const [todos, setTodos] = useState<Todo[]>([]);

    type SortBy = 'create_at' | 'due_date'

    const sortBySelection: {
        title: string;
        value: SortBy;
    }[] = [
        {
            title: t('common.label_create_at'),
            value: 'create_at', 
        }, {
            title:  t('common.label_up_coming'),
            value: 'due_date', 
        },
    ];

    const [sortBy, setSortBy] = useState<SortBy>(sortBySelection[0].value);
    const [sortDirection, setSortDirection] = useState<'asc'|'desc'>('desc');

    const handleSortByChange = (event: SelectChangeEvent) => {
        setSortBy(event.target.value as SortBy);
    };

    const handleSortDirectionChange = () => {
        if (sortDirection === 'asc') {
            setSortDirection('desc');
        } else {
            setSortDirection('asc');
        }
    };

    const {
        data: categories,
        isLoading: isLoadingCategories,
        refetch: refetchCategories, 
    } = useQuery({
        queryKey: ['categories', 'list'],
        queryFn: CategoryApi.list,
    });

    const {
        data: rawTodos,
        isLoading: isLoadingTodos,
        refetch: refetchTodos,
    } = useQuery({
        queryKey: ['todos', selectedCategoryId],
        queryFn: () => {
            const params: GetTodosRequest = {};
    
            if (selectedCategoryId) {
                params.categoryId = selectedCategoryId;
            }

            return TodoApi.list(params);
        },
    });
    
    useEffect(() => {
        const sortByRecentlyCompleted = (a: Todo, b: Todo) => {
            const aTime = a.completed_at ? createDate(a.completed_at).valueOf() : 0;
            const bTime = b.completed_at ? createDate(b.completed_at).valueOf() : 0;
    
            return bTime - aTime;
        };
        
        const sortByDueDate = (a: Todo, b: Todo) => {
            const aTime = a.due_date ? createDate(a.due_date).valueOf() : Infinity;
            const bTime = b.due_date ? createDate(b.due_date).valueOf() : Infinity;

            return aTime - bTime;
        };
    
        const sortByRecentlyCreated = (a: Todo, b: Todo) => {
            const aTime = createDate(a.create_at).valueOf();
            const bTime = createDate(b.create_at).valueOf();
    
            return sortDirection === 'asc' ? aTime - bTime : bTime - aTime;
        };
        
        const sortByFuncs = (a: Todo, b: Todo) => {
            if (sortBy === 'due_date') {
                return sortByDueDate(a, b);
            }
    
            return sortByRecentlyCreated(a, b);
        };

        // 分堆 & 排序
        setTodos(
            [
                ...(rawTodos ?? []).filter((v) => !!v.starred).sort(sortByFuncs),
                ...(rawTodos ?? []).filter((v) => !v.starred && !v.completed_at).sort(sortByFuncs),
                ...(rawTodos ?? []).filter((v) => !!v.completed_at).sort(sortByRecentlyCompleted),
            ],
        );
    }, [
        rawTodos,
        sortBy,
        sortDirection,
    ]);

    if (!account)  {
        return (
            <PageContainer>
                <ControlPanel title={t('view_dashboard.title')}  />
                Loading...
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <ControlPanel
                title={t('view_dashboard.title')}
                onRefresh={refetchTodos}
            />

            {/* 新增待辦 */}
            <Stack
                direction="row"
                sx={{ width: '100%' }}
            >
                <AddTodo
                    categories={categories ?? []}
                    onRefresh={refetchTodos}
                />
            </Stack>

            <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ my: 3 }}
            >
                <IconButton onClick={handleSortDirectionChange}>
                    <SwapVertIcon/>
                </IconButton>
                <Select
                    value={sortBy}
                    size="small"
                    onChange={handleSortByChange}
                >
                    {sortBySelection.map((item) => (
                        <MenuItem
                            key={item.value}
                            value={item.value}
                        >
                            {item.title}
                        </MenuItem>
                    ))}
                </Select>
            </Stack>

            <Stack
                direction="column"
                spacing={1}
            >

                {isLoadingTodos && 'Loading...'}

                {!todos.length && <Typography>{t('view_dashboard.message_no_todos')}</Typography>}

                {todos.map((todo) => {
                    return (
                        <TodoItem
                            key={todo.id}
                            todo={todo}
                            categories={categories ?? []}
                            editingTodoId={editingTodoId}
                            setEditingTodoId={setEditingTodoId}
                            onUpdate={refetchTodos}
                        />
                    );
                })}
            </Stack>

        </PageContainer>
    );
};