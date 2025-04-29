import React, { FC } from 'react';

import {
    useDispatch,
    useSelector,
} from 'react-redux';

import CloseIcon from '@mui/icons-material/Close';
import {
    Alert,
    ClickAwayListener,
    IconButton,
    keyframes,
    Snackbar,
    Stack,
} from '@mui/material';

import { RootState } from '../../store';
import { hideNotification } from '../../store/notificationSlice';

const snackbarInRight = keyframes`
  from {
    transform: translateX(100%);
  }

  to {
    transform: translateX(0);
  }
`;

const NotificationSnackbar: FC = () => {
    const dispatch = useDispatch();
    const {
        open,
        message,
        type, 
    } = useSelector((state: RootState) => state.notification);

    const handleClose = () => {
        dispatch(hideNotification());
    };

    return (
        <>
            {open ? (
                <ClickAwayListener onClickAway={handleClose}>
                    <Snackbar
                        open={true}
                        autoHideDuration={5000}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right', 
                        }}
                        sx={{
                            animation: `${snackbarInRight} 200ms`,
                            transition: 'transform 0.2s ease-out',
                        }}
                    >
                        <Alert
                            severity={type === 'normal' ? 'info' : type}
                            onClose={handleClose}
                            variant="filled"
                            action={
                                <IconButton
                                    onClick={() => handleClose()}
                                    size="small"
                                    disableRipple={true}
                                    sx={{
                                        p: 0,
                                        color: 'white',
                                        bgcolor: 'transparent',
                                        '&:hover': { background: 'transparent' }, 
                                    }}
                                >
                                    <CloseIcon  />
                                </IconButton>
                            }
                        >
                            <Stack
                                direction="row"
                                alignItems="center"
                            >
                                {message}
                            </Stack>
                        </Alert>
                    </Snackbar>
                </ClickAwayListener>
            ) : null}
        </>
    );
};

export default NotificationSnackbar;
