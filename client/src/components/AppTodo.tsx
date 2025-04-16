import {
    Card,
    CardContent,
    Stack,
    Typography,
} from '@mui/material';

import { Todo } from '../types/todo';

export const AppTodo = ({ todo }: {todo: Todo}) => {
    return (
        <>
            <Card
                variant="outlined"
            >
                <CardContent>
                    <Stack
                        direction="row"
                        spacing={1}
                    >
                        <Typography
                            width="100%"
                            variant="caption"
                        >
                            {todo.category.title}
                        </Typography>
                    </Stack>

                    <Stack
                        direction="row"
                        spacing={1}
                    >
                        <Typography>
                            {todo.title}
                        </Typography>
                    </Stack>
                </CardContent>
            </Card>
        </>
    );
};
