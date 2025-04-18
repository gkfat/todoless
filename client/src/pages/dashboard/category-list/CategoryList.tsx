import { useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import {
    CardContent,
    Collapse,
    Icon,
    IconButton,
    Stack,
    Typography,
} from '@mui/material';

import { Category } from '../../../types/category';
import { Card } from '../components/Card';
import { AddCategory } from './components/AddCategory';
import { CategoryItem } from './components/CategoryItem';

interface CategoryListProps {
    categories: Category[];
    isLoading: boolean;
    onRefresh: () => void;
}

export const CategoryList = (props: CategoryListProps) => {
    const {
        categories,
        isLoading,
        onRefresh, 
    } = props;
    const [showAddCategory, setShowAddCategory] = useState(false);
    const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);

    const onAddCategory =() => {
        setShowAddCategory(false);
        onRefresh();
    };

    return (
        <Card
            variant="outlined"
            sx={{ width: '100%' }}
        >
            <CardContent>
                <Stack
                    direction="row"
                    sx={{
                        alignItems: 'center',
                        gap: 1,
                        mb: 1,
                    }}
                >
                    <Icon>
                        <SpaceDashboardIcon />
                    </Icon>

                    <Typography
                        variant="h5"
                        sx={{ mr: 'auto' }}
                    >
                        所有分類
                    </Typography>

                    {
                        !showAddCategory && <IconButton
                            onClick={() => setShowAddCategory((prev) => !prev)}
                        >
                            <AddIcon />
                        </IconButton>
                    }

                    <IconButton
                        onClick={() => onRefresh()}
                    >
                        <RefreshIcon />
                    </IconButton>
                </Stack>
          
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
            </CardContent>
        </Card>
    );
};