import { useRef } from 'react';

import { Grid } from '@mui/material';

import { PageContainer } from '../../components/PageContainer';
import { TodoList } from './cards/TodoList';
import { TotalAccounts } from './cards/TotalAccounts';
import { ControlPanel } from './components/ControlPanel';

export const DashboardPage = () => {
    const totalAccountsRef = useRef<{ refetch: () => void }>(null);
    const todoListRef = useRef<{ refetch: () => void }>(null);

    const handleRefresh = () => {
        totalAccountsRef.current?.refetch();
        todoListRef.current?.refetch();
    };

    return (
        <PageContainer>
            <ControlPanel onRefresh={handleRefresh} />
            {/* 
            <Stack 
                direction="row"
                sx={{ mb:3 }}
            >
                <AddTodo onRefresh={handleRefresh} />
            </Stack> */}

            <Grid
                container
                spacing={2}
                size={{
                    xs: 12,
                    md: 6, 
                }}
            >
                <TodoList ref={todoListRef} />
            
                <TotalAccounts ref={totalAccountsRef} />
            </Grid>
            
        </PageContainer>
    );
};