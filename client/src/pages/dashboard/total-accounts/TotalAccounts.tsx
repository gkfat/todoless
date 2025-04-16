import {
    forwardRef,
    useImperativeHandle,
} from 'react';

import PeopleIcon from '@mui/icons-material/PeopleAltRounded';
import {
    CardContent,
    Icon,
    Stack,
    Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';

import { AccountApi } from '../../../api/accounts';
import { Card } from '../components/Card';

export const TotalAccounts = forwardRef((_, ref) => {
    const {
        data, refetch, 
    } = useQuery({
        queryKey: ['accounts', 'list'],
        queryFn: AccountApi.list,
        refetchOnMount: true,
    });

    useImperativeHandle(ref, () => ({ refetch }));

    const accountNumber = data?.length ?? 0;

    return (
        <>
            <Card
                sx={{
                    maxWidth: '300px',
                    alignSelf: 'stretch',
                }}
                variant="outlined"
            >
                <CardContent sx={{ height: '100%' }}>
                    <Stack
                        direction="row"
                        sx={{
                            alignItems: 'center',
                            gap: 1,
                            mb: 3,
                        }}
                    >
                        <Icon>
                            <PeopleIcon />
                        </Icon>

                        <Typography
                            variant="h5"
                        >
                            帳號總數
                        </Typography>
                    </Stack>
            
                    <Typography
                        variant="h1"
                        color="primary"
                    >
                        {accountNumber}
                    </Typography>
                </CardContent>
            </Card>
        </>
    );
});