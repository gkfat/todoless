import { ReactNode } from 'react';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import {
    Box,
    Card as MuiCard,
    CardContent,
    Collapse,
    Icon,
    IconButton,
    Stack,
    styled,
    Typography,
} from '@mui/material';

export const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    height: '100%',
    gap: theme.spacing(2),
    flex: 1,
    [theme.breakpoints.down('sm')]: { minWidth: '100%' },
    boxShadow:
      'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
    ...theme.applyStyles('dark', {
        boxShadow:
        'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
    }),
}));

interface DashboardCardProps {
    title: string;
    icon: ReactNode;
    toolbar?: ReactNode;
    collapsed?: boolean;
    onToggleCollapse?: () => void;
    children?: ReactNode;
}

export const DashboardCard = (props: DashboardCardProps) => {
    const {
        title,
        icon,
        toolbar,
        collapsed = false,
        onToggleCollapse,
        children,
    } = props;

    return (
        <Card
            variant="outlined"
            sx={{ width: '100%' }}
        >
            <CardContent
                sx={{ '&:last-child': { pb: collapsed ? 2 : 4 } }}
            >
                <Stack
                    direction="row"
                    alignItems="center"
                    gap={1}
                >
                    <Icon>{icon}</Icon>

                    <Typography
                        variant="h5"
                        sx={{ mr: 'auto' }}
                    >
                        {title}
                    </Typography>

                    {!collapsed && toolbar}

                    {onToggleCollapse && (
                        <IconButton onClick={onToggleCollapse}>
                            {collapsed ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
                        </IconButton>
                    )}
                </Stack>

                <Collapse in={!collapsed}>
                    <Box sx={{ mt: 2 }}>
                        {children}
                    </Box>
                </Collapse>
            </CardContent>
        </Card>
    );
};

