import FactCheckIcon from '@mui/icons-material/FactCheckRounded';
import {
    Stack,
    Typography,
} from '@mui/material';

export const AppLogo = () => {
    return (
        <Stack
            direction="row"
            spacing={1}
            sx={{
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            
            <FactCheckIcon
                fontSize="large"
                color="primary"
            />
            
            <Typography
                variant="h4"
                component="h1"
                color="primary"
            >
                TodoLess
            </Typography>
        </Stack>
    );
};
