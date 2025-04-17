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
        isLoading: isLoadingCategories,
        refetch: refetchCategories, 
    } = useQuery({
        queryKey: ['categories', 'list'],
        queryFn: CategoryApi.list,
        refetchOnMount: false,
    });

    const [selectedCategory, setSelectedCategory] = useState<Category>();
    
    const {
        data: todos,
        isLoading: isLoadingTodos,
        refetch: refetchTodos,
    } = useQuery({
        queryKey: ['todos', selectedCategory?.id],
        queryFn: () => {
            const params: GetTodosRequest = { categoryId: selectedCategory?.id };
    
            return TodoApi.list(params);
        },
        refetchOnMount: false,
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
                            isLoading={isLoadingCategories}
                            categories={categories ?? []}
                        />
                        <TodoList
                            todos={todos ?? []}
                            isLoading={isLoadingTodos}
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