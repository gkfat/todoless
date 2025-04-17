import {
    forwardRef,
    useImperativeHandle,
} from 'react';

import FactCheckIcon from '@mui/icons-material/FactCheckRounded';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
    CardContent,
    Icon,
    IconButton,
    Paper,
    Stack,
    Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';

import { TodoApi } from '../../../api/todos';
import { Card } from '../components/Card';
import { TodoItem } from './components/TodoItem';

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
        <Card
            variant="outlined"
            sx={{ width: '100%' }}
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
                        待辦
                    </Typography>

                    <IconButton
                        sx={{ ml: 'auto' }}
                        onClick={() => refetch()}
                    >
                        <RefreshIcon />
                    </IconButton>
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
                                    <Paper
                                        key={todo.id}
                                        sx={{ width: '100%' }}
                                    >
                                        <TodoItem
                                            todo={todo}
                                        />
                                    </Paper>
                                );
                            })
                    }
                </Stack>
            </CardContent>
        </Card>
    );
});