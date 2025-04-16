import {
    forwardRef,
    useEffect,
    useImperativeHandle,
} from 'react';

import CategoryIcon from '@mui/icons-material/Category';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
    CardContent,
    Icon,
    IconButton,
    Stack,
    Typography,
} from '@mui/material';
import {
    useMutation,
    useQuery,
} from '@tanstack/react-query';

import { CategoryApi } from '../../../api/categories';
import { Card } from '../components/Card';
import { CategoryItem } from './components/CategoryItem';

export const CategoryList = forwardRef((_, ref) => {
    const {
        data: categories,
        refetch, 
    } = useQuery({
        queryKey: ['categories', 'list'],
        queryFn: CategoryApi.list,
        refetchOnMount: true,
    });

    const createCategoryMutation = useMutation({
        mutationFn: CategoryApi.create,
        onSuccess: () => {
            refetch();
        },
    });

    useEffect(() => {
        if (categories && !categories.length) {
            createCategoryMutation.mutate({
                title: '未分類',
                color: 'primary',
            });
        }
    }, [categories, createCategoryMutation]);

    useImperativeHandle(ref, () => ({ refetch }));

    return (
        <Card
            variant="outlined"
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
                    >
                            類別清單
                    </Typography>

                    <IconButton
                        sx={{ ml: 'auto' }}
                        onClick={() => refetch()}
                    >
                        <RefreshIcon />
                    </IconButton>
                </Stack>
                    
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
                                        onUpdate={() => refetch()}
                                        key={item.id}
                                        category={item}
                                    />
                                );
                            })
                    }
                </Stack>
            </CardContent>
        </Card>
    );
});