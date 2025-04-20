import { useRef } from 'react';

import { useTranslation } from 'react-i18next';
import {
    useDispatch,
    useSelector,
} from 'react-redux';

import {
    closestCenter,
    DndContext,
    DragEndEvent,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    useSortable,
} from '@dnd-kit/sortable';
import {
    Grid,
    Stack,
} from '@mui/material';
import {
    useMutation,
    useQuery,
} from '@tanstack/react-query';

import { AccountApi } from '../../api/accounts';
import { CategoryApi } from '../../api/categories';
import { ControlPanel } from '../../components/ControlPanel';
import { PageContainer } from '../../components/PageContainer';
import { SortableCardWrapper } from '../../components/SortableCardWrapper';
import { DashboardCardType } from '../../enums/dashboard';
import { RootState } from '../../store';
import { setAccount } from '../../store/authSlice';
import { DashboardConfig } from '../../types/dashboard';
import { CategoryList } from './category-list/CategoryList';
import { AddTodo } from './todo-list/components/AddTodo';
import {
    DueDatesTodoList,
    DueDatesTodoListRef,
} from './todo-list/DueDatesTodoList';
import {
    RecentlyAddedTodoList,
    RecentlyAddedTodoListRef,
} from './todo-list/RecentlyAddedTodoList';
import {
    RecentlyCompletedTodoList,
    RecentlyCompletedTodoListRef,
} from './todo-list/RecentlyCompletedTodoList';
import {
    StarredTodoList,
    StarredTodoListRef,
} from './todo-list/StarredTodoList';

const defaultDashboardConfigs: DashboardConfig[] = [
    {
        type: DashboardCardType.CATEGORY_LIST,
        col: 1,
        order: 1,
        display: true,
    },
    {
        type: DashboardCardType.RECENTLY_ADDED,
        col: 1,
        order: 2,
        display: true,
    },
    {
        type: DashboardCardType.DUE_DATES,
        col: 1,
        order: 3,
        display: true,
    },
    {
        type: DashboardCardType.STARRED,
        col: 2,
        order: 1,
        display: true,
    },
    {
        type: DashboardCardType.RECENTLY_COMPLETED,
        col: 2,
        order: 2,
        display: true,
    },
];

export const DashboardPage = () => {
    const { t } = useTranslation();
    const sensors = useSensors(useSensor(PointerSensor));
    const recentlyCompletedTodoListRef = useRef<RecentlyCompletedTodoListRef>(null);
    const recentlyAddedTodoListRef = useRef<RecentlyAddedTodoListRef>(null);
    const starredTodoListRef = useRef<StarredTodoListRef>(null);
    const dueDatesTodoListRef = useRef<DueDatesTodoListRef>(null);

    const account = useSelector((state: RootState) => state.auth.account);
    const dispatch = useDispatch();

    const {
        data: categories,
        isLoading: isLoadingCategories,
        refetch: refetchCategories, 
    } = useQuery({
        queryKey: ['categories', 'list'],
        queryFn: CategoryApi.list,
        refetchOnMount: false,
    });

    const refreshAll = () => {
        refetchCategories();
        recentlyCompletedTodoListRef.current?.onRefresh();
        recentlyAddedTodoListRef.current?.onRefresh();
        starredTodoListRef.current?.onRefresh();
    };

    const updateConfigMutation = useMutation({
        mutationFn: AccountApi.updateConfig,
        onSuccess: (data) => {
            dispatch(setAccount(data));

            refreshAll();
        },
        onError: (error: any) => {
            console.error(error);
        },
    });

    if (!account)  {
        return (
            <PageContainer>
                <ControlPanel title={t('view_dashboard.title')}  />
                Loading config...
            </PageContainer>
        );
    }

    const configs = account?.dashboard_configs.length ? account.dashboard_configs : defaultDashboardConfigs;

    const onDashboardConfigUpdate = (c: DashboardConfig) => {
        if (!account) {
            return;
        }
        
        const mutatedConfigs = configs.map((v) => {
            if (v.type === c.type) {
                return c;
            }

            return v;
        });

        updateConfigMutation.mutate({
            accountId: account.id,
            dashboardConfigs: mutatedConfigs,
        });
    };

    const renderCard = (c: DashboardConfig, dragListeners?: ReturnType<typeof useSortable>['listeners']) => {
        const cardProps = {
            categories: categories ?? [],
            dashboardConfig: c,
            onDashboardConfigUpdate,
            dragListeners,
        };
        
        switch (c.type) {
        case DashboardCardType.CATEGORY_LIST:
            return <CategoryList 
                key={c.type}
                isLoading={isLoadingCategories}
                onRefresh={refreshAll}
                {...cardProps}
            />;
        case DashboardCardType.RECENTLY_ADDED:
            return <RecentlyAddedTodoList
                key={c.type}
                ref={recentlyAddedTodoListRef}
                {...cardProps}
            />;
        case DashboardCardType.DUE_DATES:
            return <DueDatesTodoList
                key={c.type}
                ref={dueDatesTodoListRef}
                {...cardProps}
            />;
        case DashboardCardType.STARRED:
            return <StarredTodoList
                key={c.type}
                ref={starredTodoListRef}
                {...cardProps}
            />;
        case DashboardCardType.RECENTLY_COMPLETED:
            return <RecentlyCompletedTodoList
                key={c.type}
                ref={recentlyCompletedTodoListRef}
                {...cardProps}
            />;
        default: break;
        }
    };

    const isRightSide = (event: DragEndEvent) => {
        const x = event?.delta?.x ?? 0;
        return x > 300; // 自訂 threshold，可以根據實際畫面寬度微調
    };

    const sortedConfigs = [...configs].sort((a,b) => a.order - b.order);
    const ids = sortedConfigs.map((c) => c.type);

    const handleDragEnd = (event: DragEndEvent) => {
        const {
            active,
            over, 
        } = event;
            
        if (!over || active.id === over.id) {
            return;
        }

        const oldIndex = sortedConfigs.findIndex((c) => c.type === active.id);
        const newIndex = sortedConfigs.findIndex((c) => c.type === over.id);

        const draggedItem = sortedConfigs[oldIndex];
        const movedList = arrayMove<DashboardConfig>(sortedConfigs, oldIndex, newIndex);
        const rightSide = isRightSide(event);

        let col1Order = 1;
        let col2Order = 1;

        const newConfigs: DashboardConfig[] = movedList.map((c) => {
            if (c.type === draggedItem.type) {
                const newCol = rightSide ? 2 : 1;
                const newOrder = newCol === 1 ? col1Order++ : col2Order++;
                return {
                    ...c,
                    col: newCol,
                    order: newOrder, 
                };
            } else {
                const newOrder = c.col === 1 ? col1Order++ : col2Order++;
                return {
                    ...c,
                    order: newOrder, 
                };
            }
        });

        updateConfigMutation.mutate({
            accountId: account!.id,
            dashboardConfigs: newConfigs,
        });
    };

    return (
        <PageContainer>
            <ControlPanel title={t('view_dashboard.title')}  />

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
                    onRefresh={refreshAll}
                />
            </Stack>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={ids}
                >
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
                                {sortedConfigs
                                    .filter((c) => c.col === 1)
                                    .map((c) => (
                                        <SortableCardWrapper
                                            key={c.type}
                                            id={c.type}
                                        >
                                            {({ listeners }) => renderCard(c, listeners)}
                                        </SortableCardWrapper>
                                    ))
                                }
                            </Stack>
                        </Grid>
                        <Grid
                            size={{
                                xs: 12,
                                md: 6,
                            }}
                        >
                            <Stack spacing={1}>
                                {sortedConfigs
                                    .filter((c) => c.col === 2)
                                    .map((c) => (
                                        <SortableCardWrapper
                                            key={c.type}
                                            id={c.type}
                                        >
                                            {({ listeners }) => renderCard(c, listeners)}
                                        </SortableCardWrapper>
                                    ))
                                }
                            </Stack>
                        </Grid>
                    </Grid>
                </SortableContext>
            </DndContext>
        </PageContainer>
    );
};