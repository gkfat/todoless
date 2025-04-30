import { FC } from 'react';

import {
    useDispatch,
    useSelector,
} from 'react-redux';

import {
    Alert,
    keyframes,
    Snackbar,
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
                <Snackbar
                    open={true}
                    autoHideDuration={10000}
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
                        variant="outlined"
                    >
                        {message}
                    </Alert>
                </Snackbar>
            ) : null}
        </>
    );
};

export default NotificationSnackbar;
