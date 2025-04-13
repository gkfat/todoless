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
                    height: '100%',
                }}
            >
                {children}
            </Container>
        </>
    );
};