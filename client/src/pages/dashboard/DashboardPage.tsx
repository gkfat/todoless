import { useRef } from 'react';

import { useTranslation } from 'react-i18next';

import {
    Grid,
    Stack,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';

import { CategoryApi } from '../../api/categories';
import { ControlPanel } from '../../components/ControlPanel';
import { PageContainer } from '../../components/PageContainer';
import { CategoryList } from './category-list/CategoryList';
import {
    RecentlyAddedTodoList,
    RecentlyAddedTodoListRef,
} from './recently-added-todo-list/RecentlyAddedTodoList';
import {
    RecentlyCompletedTodoList,
    RecentlyCompletedTodoListRef,
} from './recently-completed-todo-list/RecentlyCompletedTodoList';

export const DashboardPage = () => {
    const { t } = useTranslation();
    const recentlyCompletedTodoListRef = useRef<RecentlyCompletedTodoListRef>(null);
    const recentlyAddedTodoListRef = useRef<RecentlyAddedTodoListRef>(null);
        
    const {
        data: categories,
        isLoading: isLoadingCategories,
        refetch: refetchCategories, 
    } = useQuery({
        queryKey: ['categories', 'list'],
        queryFn: CategoryApi.list,
        refetchOnMount: false,
    });

    const onCategoryListUpdate = () => {
        refetchCategories();
        recentlyCompletedTodoListRef.current?.onRefresh();
        recentlyAddedTodoListRef.current?.onRefresh();
    };

    return (
        <PageContainer>
            <ControlPanel title={t('view_dashboard.title')}  />

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
                    <Stack spacing={1}>
                        <CategoryList
                            onRefresh={onCategoryListUpdate}
                            isLoading={isLoadingCategories}
                            categories={categories ?? []}
                        />
                        <RecentlyAddedTodoList
                            ref={recentlyAddedTodoListRef}
                            categories={categories ?? []}
                        />
                    </Stack>
                </Grid>

                <Grid
                    size={{
                        xs: 12,
                        sm: 6,
                    }}
                >
                    <RecentlyCompletedTodoList
                        ref={recentlyCompletedTodoListRef}
                        categories={categories ?? []}
                    />
                </Grid>
            </Grid>
            
        </PageContainer>
    );
};