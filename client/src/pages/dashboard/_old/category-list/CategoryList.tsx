import { useState } from 'react';

import { useSortable } from '@dnd-kit/sortable';
import AddIcon from '@mui/icons-material/Add';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
    Collapse,
    IconButton,
    Stack,
    Typography,
} from '@mui/material';

import { Category } from '../../../../types/category';
import { DashboardConfig } from '../../../../types/dashboard';
import { DashboardCard } from '../components/DashboardCard';
import { AddCategory } from './components/AddCategory';
import { CategoryItem } from './components/CategoryItem';

interface CategoryListProps {
    categories: Category[];
    isLoading: boolean;
    onRefresh: () => void;
    dashboardConfig: DashboardConfig;
    onDashboardConfigUpdate: (c: DashboardConfig) => void;
    dragListeners?: ReturnType<typeof useSortable>['listeners'];
}

export const CategoryList = (props: CategoryListProps) => {
    const {
        categories,
        isLoading,
        onRefresh,
        dashboardConfig,
        onDashboardConfigUpdate,
        dragListeners,
    } = props;
    const [showAddCategory, setShowAddCategory] = useState(false);
    const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);

    const onAddCategory =() => {
        setShowAddCategory(false);
        onRefresh();
    };

    const handleDisplayToggle = () => {
        const config = {
            ...dashboardConfig,
            display: !dashboardConfig.display,
        };
    
        onDashboardConfigUpdate(config);
    };
    
    return (
        <DashboardCard
            title="所有分類"
            icon={
                <IconButton
                    {...dragListeners}
                    className="drag-handle"
                    sx={{ cursor: 'grab' }}
                >
                    <DragIndicatorIcon />
                </IconButton>
            }
            collapsed={!dashboardConfig.display}
            onToggleCollapse={handleDisplayToggle}
            toolbar={
                <>
                    {
                        !showAddCategory && <IconButton
                            onClick={() => setShowAddCategory((prev) => !prev)}
                        >
                            <AddIcon />
                        </IconButton>
                    }
        
                    <IconButton
                        onClick={onRefresh}
                    >
                        <RefreshIcon />
                    </IconButton>
                </>
            }
        >
            {/* 新增分類 */}
            <Collapse
                in={showAddCategory}
                timeout={300}
                unmountOnExit
                orientation="vertical"
            >
                <Stack
                    direction="row"
                    gap={1}
                    sx={{ mb: 2 }}
                >
                    <AddCategory
                        onRefresh={onAddCategory}
                        onClose={() => setShowAddCategory(false)}
                    />
                </Stack>
            </Collapse>

            {/* 分類清單 */}
            <Stack
                direction="row"
                flexWrap="wrap"
                gap={1}
            >
                {isLoading && (
                    <Typography>Loading...</Typography>
                )}

                {!isLoading && !categories.length && (
                    <Typography>沒有分類。</Typography>
                )}

                {categories.map((item) => {
                    return (
                        <CategoryItem
                            key={item.id}
                            category={item}
                            onUpdate={() => onRefresh()}
                            editingCategoryId={editingCategoryId}
                            setEditingCategoryId={setEditingCategoryId}
                        />
                    );
                })}
            </Stack>
        </DashboardCard>
    );
};