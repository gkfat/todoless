import {
    Card,
    CardContent,
    Stack,
    Typography,
} from '@mui/material';

import { Todo } from '../../../../types/todo';

export const TodoItem = ({ todo }: {todo: Todo}) => {
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
                            {todo.category?.title ?? '未分類'}
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
