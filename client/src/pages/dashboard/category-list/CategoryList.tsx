import {
    useEffect,
    useState,
} from 'react';

import AddIcon from '@mui/icons-material/Add';
import CategoryIcon from '@mui/icons-material/Category';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
    CardContent,
    Collapse,
    Icon,
    IconButton,
    Stack,
    Typography,
    useTheme,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';

import { CategoryApi } from '../../../api/categories';
import { Category } from '../../../types/category';
import { Card } from '../components/Card';
import { AddCategory } from './components/AddCategory';
import { CategoryItem } from './components/CategoryItem';

interface CategoryListProps {
    categories: Category[];
    onRefresh: () => void;
}

export const CategoryList = ({
    categories, onRefresh, 
}: CategoryListProps) => {
    const theme = useTheme();
    const [showAddCategory, setShowAddCategory] = useState(false);
    const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);

    const createCategoryMutation = useMutation({
        mutationFn: CategoryApi.create,
        onSuccess: () => {
            onRefresh();
        },
    });

    useEffect(() => {
        if (categories && !categories.length) {
            createCategoryMutation.mutate({
                title: '未分類',
                color: theme.palette.primary.main,
            });
        }
    }, [
        categories,
        createCategoryMutation,
        theme,
    ]);

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
                        <CategoryIcon />
                    </Icon>

                    <Typography
                        variant="h5"
                        sx={{ mr: 'auto' }}
                    >
                        分類
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
                    {
                        !categories
                            ? <Typography>Loading...</Typography>
                            : categories.map((item) => {
                                return (
                                    <CategoryItem
                                        key={item.id}
                                        category={item}
                                        onUpdate={() => onRefresh()}
                                        editingCategoryId={editingCategoryId}
                                        setEditingCategoryId={setEditingCategoryId}
                                    />
                                );
                            })
                    }
                </Stack>
            </CardContent>
        </Card>
    );
};