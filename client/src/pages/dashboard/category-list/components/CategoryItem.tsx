import { useState } from 'react';

import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { yupResolver } from '@hookform/resolvers/yup';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import {
    Card,
    IconButton,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';

import { CategoryApi } from '../../../../api/categories';
import { Category } from '../../../../types/category';

const addCategoryFormSchema = yup.object({
    title: yup
        .string()
        .required('此為必填欄位')
        .max(20, '類別標題不可超過 20 個字'),
    color: yup
        .string(),
});

interface CategoryItemProps {
    category: Category;
    onUpdate: () => void
}

export const CategoryItem = ({
    category, onUpdate, 
}: CategoryItemProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm({ resolver: yupResolver(addCategoryFormSchema) });

    const toggleEditMode = (targetMode: boolean, category?: Category) => {
        if (targetMode === true) {
            if (category) {
                setValue('title', category.title);
                setValue('color', category.color);
            }
        } else {
            reset();
        }

        setIsEditing(targetMode);
    };

    const updateCategoryMutation = useMutation({
        mutationFn: CategoryApi.update,
        onSuccess: () => {
            reset();
            toggleEditMode(false);
            onUpdate();
        },
        onError: (error: any) => {
            console.error(error);
        },
    });

    const onSubmit = (data: {title: string, color?: string}) => {
        updateCategoryMutation.mutate({
            categoryId: category.id,
            title: data.title,
            color: data.color,
        });
    };

    return (
        <>
            <Card
                variant="outlined"
                sx={{
                    py: 1,
                    px: 2,
                    borderRadius: 2,
                }}
            >
                {
                    !isEditing
                        ?  <Stack
                            direction="row"
                            spacing={1}
                            sx={{ alignItems: 'center' }}
                        >
                            <Typography
                                variant="h6"
                            >
                                {category.title}
                            </Typography>

                            <IconButton
                                sx={{ borderRadius: '50%' }}
                                onClick={() => toggleEditMode(true, category)}
                            >
                                <EditIcon />
                            </IconButton>
                        </Stack>

                        : <form onSubmit={handleSubmit(onSubmit)}>
                            <Stack
                                direction="row"
                                spacing={1}
                            >
                                <TextField
                                    {...register('title')}
                                    placeholder={'分類名稱'}
                                    fullWidth
                                    variant="outlined"
                                    error={!!errors.title}
                                    helperText={errors.title?.message}
                                />

                                <IconButton
                                    type="submit"
                                    sx={{ borderRadius: '50%' }}
                                >
                                    <CheckIcon color="success" />
                                </IconButton>

                                <IconButton
                                    sx={{ borderRadius: '50%' }}
                                    onClick={() => toggleEditMode(false)}
                                >
                                    <CloseIcon color="error" />
                                </IconButton>
                            </Stack>
                        </form>
                }
            </Card>
        </>
    );
};
