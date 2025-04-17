import { useState } from 'react';

import {
    Grid,
    Stack,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';

import { CategoryApi } from '../../api/categories';
import {
    GetTodosRequest,
    TodoApi,
} from '../../api/todos';
import { PageContainer } from '../../components/PageContainer';
import { Category } from '../../types/category';
import { CategoryList } from './category-list/CategoryList';
import { ControlPanel } from './components/ControlPanel';
import { TodoList } from './todo-list/TodoList';

export const DashboardPage = () => {
    const {
        data: categories,
        refetch: refetchCategories, 
    } = useQuery({
        queryKey: ['categories', 'list'],
        queryFn: CategoryApi.list,
        refetchOnMount: true,
    });

    const [selectedCategory, setSelectedCategory] = useState<Category>();
    const params: GetTodosRequest = { categoryId: selectedCategory?.id };
    
    const {
        data: todos,
        refetch: refetchTodos,
    } = useQuery({
        queryKey: ['todos', params],
        queryFn: ({ queryKey }) => {
            const params = queryKey[1] as GetTodosRequest;
    
            return TodoApi.list(params);
        },
        refetchOnMount: true,
    });

    const onCategoryListUpdate = () => {
        refetchCategories();
        refetchTodos();
    };

    const onTodoListUpdate = () => {
        refetchTodos();
    };

    return (
        <PageContainer>
            <ControlPanel />

            <Grid
                container
                spacing={2}
            >
                <Grid
                    size={{
                        xs: 12,
                        sm: 8,
                    }}
                >
                    <Stack spacing={1}>
                        <CategoryList
                            onRefresh={onCategoryListUpdate}
                            categories={categories ?? []}
                        />
                        <TodoList
                            todos={todos ?? []}
                            categories={categories ?? []}
                            selectedCategory={selectedCategory}
                            onSelectedCategoryChange={(c?: Category) => setSelectedCategory(c)}
                            onRefresh={onTodoListUpdate}
                        />
                    </Stack>
                </Grid>
            
                {/* <Grid
                    size={{
                        xs: 12,
                        sm: 6,
                    }}
                >

                    <TotalAccounts ref={totalAccountsRef} />
                </Grid> */}
            </Grid>
            
        </PageContainer>
    );
};