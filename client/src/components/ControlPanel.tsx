import RefreshIcon from '@mui/icons-material/Refresh';
import {
    IconButton,
    Stack,
    Typography,
} from '@mui/material';

interface ControlPanelProps {
    title: string;
    onRefresh?: () => void;
}

export const ControlPanel = ({
    title, onRefresh, 
} : ControlPanelProps) => {

    return (
        <>
            <Stack
                direction="row"
                alignItems="center"
                sx={{ py: 1 }}
            >
                <Typography variant="h4">
                    {title}
                </Typography>

                {
                    onRefresh && <IconButton
                        sx={{ ml: 'auto' }}
                        onClick={onRefresh}
                    >
                        <RefreshIcon/>
                    </IconButton>
                }
            </Stack>
        </>
    );
};