import {
    useEffect,
    useState,
} from 'react';

import { useTranslation } from 'react-i18next';
import {
    useDispatch,
    useSelector,
} from 'react-redux';

import { Stack } from '@mui/material';
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

    const sortByRecentlyCompleted = (a: Todo, b: Todo) => {
        const aTime = a.completed_at ? createDate(a.completed_at).valueOf() : 0;
        const bTime = b.completed_at ? createDate(b.completed_at).valueOf() : 0;

        return bTime - aTime;
    };

    const sortByRecentlyCreated = (a: Todo, b: Todo) => {
        const aTime = createDate(a.create_at).valueOf();
        const bTime = createDate(b.create_at).valueOf();

        return bTime - aTime;
    };

    useEffect(() => {
        // 分堆 & 排序
        setTodos(
            [
                ...(rawTodos ?? []).filter((v) => !!v.starred),
                ...(rawTodos ?? []).filter((v) => !v.starred && !v.completed_at).sort(sortByRecentlyCreated),
                ...(rawTodos ?? []).filter((v) => !!v.completed_at).sort(sortByRecentlyCompleted),
            ],
        );
    }, [rawTodos]);

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
                sx={{
                    width: '100%',
                    mb: 3, 
                }}
            >
                <AddTodo
                    categories={categories ?? []}
                    onRefresh={refetchTodos}
                />
            </Stack>

            <Stack
                direction="column"
                spacing={1}
            >
                {isLoadingTodos
                    ? 'Loading...'
                    : todos.map((todo) => {
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
                    })
                }
            </Stack>

        </PageContainer>
    );
};