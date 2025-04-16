import { useRef } from 'react';

import { Grid } from '@mui/material';

import { PageContainer } from '../../components/PageContainer';
import { CategoryList } from './category-list/CategoryList';
import { ControlPanel } from './components/ControlPanel';
import { TodoList } from './todo-list/TodoList';
import { TotalAccounts } from './total-accounts/TotalAccounts';

export const DashboardPage = () => {
    const totalAccountsRef = useRef<{ refetch: () => void }>(null);
    const categoryListRef = useRef<{ refetch: () => void }>(null);
    const todoListRef = useRef<{ refetch: () => void }>(null);

    const handleRefresh = () => {
        totalAccountsRef.current?.refetch();
        todoListRef.current?.refetch();
    };

    return (
        <PageContainer>
            <ControlPanel onRefresh={handleRefresh} />

            <Grid
                container
                spacing={2}
            >
                <Grid
                    size={{
                        xs: 12,
                        sm: 6,
                    }}
                >
                    <CategoryList ref={categoryListRef} />
                </Grid>

                <Grid
                    size={{
                        xs: 12,
                        sm: 6,
                    }}
                >
                    <TodoList ref={todoListRef} />
                </Grid>
            
                <Grid
                    size={{
                        xs: 12,
                        sm: 6,
                    }}
                >

                    <TotalAccounts ref={totalAccountsRef} />
                </Grid>
            </Grid>
            
        </PageContainer>
    );
};