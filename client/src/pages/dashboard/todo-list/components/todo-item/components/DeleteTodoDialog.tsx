import {
    forwardRef,
    useImperativeHandle,
    useState,
} from 'react';

import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import {
    Dialog,
    DialogActions,
    DialogContent,
    IconButton,
    Stack,
    Typography,
} from '@mui/material';

import { Todo } from '../../../../../../types/todo';

export interface DeleteTodoDialogRef {
    setOpen: (target: boolean) => void;
}

interface DeleteTodoDialogProps {
    todo: Todo;
    handleConfirmDelete: () => void;
    handleCancelDelete: () => void;
}

export const DeleteTodoDialog = forwardRef<DeleteTodoDialogRef, DeleteTodoDialogProps>((props, ref) => {
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
            <DialogContent sx={{ p: 5 }}>
                <Stack spacing={2}>
                    <Typography variant="h4">
                        確定刪除待辦？
                    </Typography>

                    <Typography
                        variant="h3"
                        fontWeight="bold"
                    >
                        {todo.title}
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
    );
});