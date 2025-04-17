import {
    useEffect,
    useState,
} from 'react';

import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { yupResolver } from '@hookform/resolvers/yup';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
    Card,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    IconButton,
    Stack,
    TextField,
    Typography,
    useTheme,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';

import { CategoryApi } from '../../../../api/categories';
import { Category } from '../../../../types/category';
import { ColorPicker } from '../../../accounts/components/ColorPicker';

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
    onUpdate: () => void;
    editingCategoryId: number | null;
    setEditingCategoryId: (id: number | null) => void;
}

export const CategoryItem = ({
    category,
    onUpdate, 
    editingCategoryId,
    setEditingCategoryId,
}: CategoryItemProps) => {
    const theme = useTheme();
    const isEditing = editingCategoryId === category.id;

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm({ resolver: yupResolver(addCategoryFormSchema) });

    useEffect(() => {
        if (isEditing) {
            setValue('title', category.title);
            setValue('color', category.color ?? '#eee');
        } else {
            reset();
        }
    }, [
        isEditing,
        category,
        reset,
        setValue,
    ]);

    const updateCategoryMutation = useMutation({
        mutationFn: CategoryApi.update,
        onSuccess: () => {
            reset();
            setEditingCategoryId(null);
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
    
    const handleColorChange = (newColorHex: string) => {
        setValue('color', newColorHex);
        
        updateCategoryMutation.mutate({
            categoryId: category.id,
            title: category.title,
            color: newColorHex,
        });
    };

    const [openConfirm, setOpenConfirm] = useState(false);
    
    const handleDeleteClick = () => {
        setOpenConfirm(true);
    };

    const handleCancelDelete = () => {
        setOpenConfirm(false);
    };

    const deleteCategoryMutation = useMutation({
        mutationFn: CategoryApi.delete,
        onSuccess: () => {
            onUpdate();
        },
        onError: (error: any) => {
            console.error(error);
        },
    });
    
    const handleConfirmDelete = () => {
        deleteCategoryMutation.mutate(category.id);
    };

    return (
        <>
            <Card
                variant="outlined"
                sx={{
                    px: 2,
                    borderRadius: 2,
                }}
            >
                <CardContent
                    sx={{
                        p: 0,
                        '&:last-child': { pb: 0 },
                    }}
                >
                    <Stack
                        direction="row"
                        spacing={1}
                        sx={{ alignItems: 'center' }}
                    >
                        {/* 顏色選擇器 */}
                        <ColorPicker
                            color={category.color ?? theme.palette.primary.main}
                            onChange={handleColorChange}
                        />
                    
                        {
                            !isEditing
                                ?  <>
                                    <Typography
                                        variant="h6"
                                    >
                                        {category.title}
                                    </Typography>

                                    <IconButton
                                        onClick={() => setEditingCategoryId(category.id)}
                                        sx={{ p: 0 }}
                                    >
                                        <EditIcon />
                                    </IconButton>

                                    <IconButton
                                        onClick={handleDeleteClick}
                                        sx={{ p: 0 }}
                                    >
                                        <DeleteIcon color="error" />
                                    </IconButton>
                                </>
                                :  
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <Stack
                                        direction="row"
                                    >
                                        <TextField
                                            {...register('title')}
                                            placeholder={'分類名稱'}
                                            fullWidth
                                            variant="outlined"
                                            error={!!errors.title}
                                            helperText={errors.title?.message}
                                            autoFocus
                                        />

                                        <IconButton
                                            type="submit"
                                        >
                                            <CheckIcon color="success" />
                                        </IconButton>

                                        <IconButton
                                            onClick={() => setEditingCategoryId(null)}
                                        >
                                            <CloseIcon color="error" />
                                        </IconButton>
                                    </Stack>
                                </form>
                        }
                    </Stack>
                </CardContent>
            </Card>

            <Dialog
                open={openConfirm}
                onClose={handleCancelDelete}
            >
                <DialogContent sx={{ p: 5 }}>
                    <Stack spacing={2}>
                        <Typography variant="h4">
                            確定刪除分類？
                        </Typography>

                        <Typography
                            variant="h3"
                            fontWeight="bold"
                        >
                            {category.title}
                        </Typography>
                    </Stack>
                </DialogContent>
                
                <DialogActions>
                    <IconButton
                        sx={{ borderRadius: '50%' }}
                        onClick={handleConfirmDelete}
                    >
                        <CheckIcon color="success" />
                    </IconButton>

                    <IconButton
                        sx={{ borderRadius: '50%' }}
                        onClick={handleCancelDelete}
                    >
                        <ClearIcon color="secondary" />
                    </IconButton>
                </DialogActions>
            </Dialog>
        </>
    );
};
