import { useTranslation } from 'react-i18next';

import RefreshIcon from '@mui/icons-material/Refresh';
import {
    IconButton,
    Stack,
    Typography,
} from '@mui/material';

export const ControlPanel = ({ onRefresh } : { onRefresh: () => void}) => {
    const { t } = useTranslation();

    return (
        <>
            <Stack
                direction="row"
                alignItems="center"
                sx={{ py: 1 }}
            >
                <Typography variant="h4">
                    {t('view_accounts.title')}
                </Typography>

                <IconButton
                    sx={{ ml: 'auto' }}
                    onClick={onRefresh}
                >
                    <RefreshIcon/>
                </IconButton>
            </Stack>
        </>
    );
};