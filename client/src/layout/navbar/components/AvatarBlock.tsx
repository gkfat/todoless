import {
    Avatar,
    Box,
    Stack,
    Typography,
} from '@mui/material';

import { Account } from '../../../types/account';

export const AvatarBlock = ({ account }: {account: Account}) => {
    return (
        <Stack
            direction="row"
            sx={{
                gap: 1,
                alignItems: 'center',
            }}
        >
            <Avatar
                sizes="small"
                src={account?.avatar ?? ''}
                sx={{
                    width: 36,
                    height: 36, 
                }}
            />
            <Box sx={{ mr: 'auto' }}>
                <Typography
                    variant="body2"
                    sx={{
                        fontWeight: 500,
                        lineHeight: '16px', 
                    }}
                >
                    {account?.name}
                </Typography>
                <Typography
                    variant="caption"
                    sx={{ color: 'text.secondary' }}
                >
                    {account?.email}
                </Typography>
            </Box>
        </Stack>
    );
};