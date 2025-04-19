import React from 'react';

import {
    Container,
    CssBaseline,
} from '@mui/material';

export const PageContainer = ({ children }: {children: React.ReactNode}) => {
    return (
        <>
            <CssBaseline enableColorScheme />
            <Container
                sx={{
                    p: 1,
                    pb: 2,
                    height: '100%',
                    overflowY: 'auto',
                }}
            >
                {children}
            </Container>
        </>
    );
};