import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { yupResolver } from '@hookform/resolvers/yup';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import {
    IconButton,
    Paper,
    Stack,
    TextField,
    useTheme,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';

import { CategoryApi } from '../../../../../api/categories';

const addCategoryFormSchema = yup.object({
    title: yup
        .string()
        .required('此為必填欄位')
        .max(20, '類別標題不可超過 20 個字'),
});

interface AddCategoryProps {
    onRefresh: () => void;
    onClose: () => void;
}

export const AddCategory = (props: AddCategoryProps) => {
    const theme = useTheme();
    const {
        onRefresh,
        onClose,
    } = props;

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({ resolver: yupResolver(addCategoryFormSchema) });

    const createCategoryMutation = useMutation({
        mutationFn: CategoryApi.create,
        onSuccess: () => {
            reset();
            onRefresh();
        },
        onError: (error: any) => {
            console.error(error);
        },
    });

    const onSubmit = (data: {title: string, color?: string}) => {
        createCategoryMutation.mutate({
            title: data.title,
            color: theme.palette.primary.main,
        });
    };

    const handleCloseClick = () => {
        reset();
        onClose();
    };

    return (
        <Paper
            sx={{ width: '100%' }}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack
                    direction="row"
                    spacing={1}
                    alignItems="start"
                >
                    <TextField
                        {...register('title')}
                        placeholder={'新增分類'}
                        fullWidth
                        variant="outlined"
                        error={!!errors.title}
                        helperText={errors.title?.message}
                        autoFocus
                        onKeyUp={(e) => {
                            if (e.key === 'Escape') {
                                handleCloseClick();
                            }
                        }}
                    />

                    <IconButton
                        type="submit"
                        sx={{ borderRadius: '50%' }}
                    >
                        <CheckIcon color="success" />
                    </IconButton>

                    <IconButton
                        sx={{ borderRadius: '50%' }}
                        onClick={handleCloseClick}
                    >
                        <CloseIcon color="error" />
                    </IconButton>
                </Stack>
            </form>
        </Paper>
    );
};