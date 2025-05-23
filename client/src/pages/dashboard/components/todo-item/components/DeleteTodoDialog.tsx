import {
    forwardRef,
    useImperativeHandle,
    useState,
} from 'react';

import { useTranslation } from 'react-i18next';

import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Stack,
    Typography,
} from '@mui/material';

import { Todo } from '../../../../../types/todo';

export interface DeleteTodoDialogRef {
    setOpen: (target: boolean) => void;
}

interface DeleteTodoDialogProps {
    todo: Todo;
    handleConfirmDelete: () => void;
    handleCancelDelete: () => void;
}

export const DeleteTodoDialog = forwardRef<DeleteTodoDialogRef, DeleteTodoDialogProps>((props, ref) => {
    const { t } = useTranslation();
    const {
        todo, handleCancelDelete, handleConfirmDelete, 
    } = props;

    const [open, setOpen] = useState(false);

    useImperativeHandle(ref, () => ({ setOpen }));
    
    return (
        <Dialog
            open={open}
            onClose={handleCancelDelete}
        >
            <DialogTitle>
                {t('view_dashboard.title_delete_todo')}
            </DialogTitle>
            
            <DialogContent sx={{ p: 2 }}>
                <Stack
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Typography
                        variant="h4"
                        fontWeight="bold"
                    >
                        {todo.title}
                    </Typography>
                </Stack>
            </DialogContent>
            
            <DialogActions>
                <IconButton
                    onClick={handleConfirmDelete}
                >
                    <CheckIcon color="success" />
                </IconButton>

                <IconButton
                    onClick={handleCancelDelete}
                >
                    <ClearIcon color="secondary" />
                </IconButton>
            </DialogActions>
        </Dialog>
    );
});