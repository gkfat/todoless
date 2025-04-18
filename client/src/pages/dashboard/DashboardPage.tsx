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
import {
    StarredTodoList,
    StarredTodoListRef,
} from './starred-todo-list/StarredTodoList';

export const DashboardPage = () => {
    const { t } = useTranslation();
    const recentlyCompletedTodoListRef = useRef<RecentlyCompletedTodoListRef>(null);
    const recentlyAddedTodoListRef = useRef<RecentlyAddedTodoListRef>(null);
    const starredTodoListRef = useRef<StarredTodoListRef>(null);
        
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
        starredTodoListRef.current?.onRefresh();
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
                        md: 6,
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
                        md: 6,
                    }}
                >
                    <Stack spacing={1}>
                        <StarredTodoList
                            ref={starredTodoListRef}
                            categories={categories ?? []}
                        />
                        <RecentlyCompletedTodoList
                            ref={recentlyCompletedTodoListRef}
                            categories={categories ?? []}
                        />
                    </Stack>
                </Grid>
            </Grid>
            
        </PageContainer>
    );
};