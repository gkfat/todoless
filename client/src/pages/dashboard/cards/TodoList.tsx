import {
    forwardRef,
    useImperativeHandle,
} from 'react';

import FactCheckIcon from '@mui/icons-material/FactCheckRounded';
import {
    CardContent,
    Icon,
    Paper,
    Stack,
    Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';

import { TodoApi } from '../../../api/todos';
import { AppTodo } from '../../../layout/navbar/components/AppTodo';
import { Card } from '../components/Card';

export const TodoList = forwardRef((_, ref) => {
    const {
        data: todos,
        refetch, 
    } = useQuery({
        queryKey: ['todos', 'list'],
        queryFn: TodoApi.list,
        refetchOnMount: true,
    });

    useImperativeHandle(ref, () => ({ refetch }));

    return (
        <>
            <Card
                sx={{
                    maxWidth: '300px',
                    alignSelf: 'stretch', 
                }}
                variant="outlined"
            >
                <CardContent>
                    <Stack
                        direction="row"
                        sx={{
                            alignItems: 'center',
                            gap: 1,
                            mb: 1,
                        }}
                    >
                        <Icon>
                            <FactCheckIcon />
                        </Icon>

                        <Typography
                            variant="h5"
                        >
                            待辦清單
                        </Typography>
                    </Stack>
                    
                    <Stack
                        direction="row"
                        flexWrap="wrap"
                        gap={1}
                    >
                        {
                            (!todos || !todos.length)
                                ? <Typography>沒有待辦事項。</Typography>

                                : todos.map((todo) => {
                                    return (
                                        <Paper sx={{ width: '100%' }}>
                                            <AppTodo todo={todo} />
                                        </Paper>
                                    );
                                })
                        }
                    </Stack>
                </CardContent>
            </Card>
        </>
    );
});