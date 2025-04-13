import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { Button } from '@mui/material';

import { logout } from '../../../store/authSlice';

export const LogoutButton = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onLogoutClick = async () => {
        dispatch(logout());
        navigate('/sign-in');
    };

    return (
        <Button
            variant="outlined"
            fullWidth
            startIcon={<LogoutRoundedIcon />}
            onClick={onLogoutClick}
        >
            {t('common.btn_logout')}
        </Button>
    );
};