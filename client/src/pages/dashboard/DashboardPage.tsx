import { useRef } from 'react';

import {
    Grid,
    Stack,
} from '@mui/material';

import { PageContainer } from '../../components/PageContainer';
import { CategoryList } from './category-list/CategoryList';
import { ControlPanel } from './components/ControlPanel';
import { TodoList } from './todo-list/TodoList';

export const DashboardPage = () => {
    const categoryListRef = useRef<{ refetch: () => void }>(null);
    const todoListRef = useRef<{ refetch: () => void }>(null);

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
                        <CategoryList ref={categoryListRef} />
                        <TodoList ref={todoListRef} />
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