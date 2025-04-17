import EventIcon from '@mui/icons-material/Event';
import {
    Card,
    CardContent,
    Grid,
    Icon,
    Stack,
    Typography,
    useTheme,
} from '@mui/material';

import { Todo } from '../../../../types/todo';
import { timeFormat } from '../../../../utils/time';

export const TodoItem = ({ todo }: {todo: Todo}) => {
    const theme = useTheme();
    const bgColor = todo.category?.color ?? theme.palette.primary.main;

    console.log(todo);
    return (
        <>
            <Card
                variant="outlined"
                sx={{
                    cursor: 'pointer',
                    position: 'relative',
                    borderColor: bgColor,

                    '&:hover': {
                        boxShadow: 3,
                        transform: 'translateY(-2px)',
                    }, 
                }}
            >
                <CardContent
                    sx={{
                        p: 1,
                        '&:last-child': { pb: 1 },
                        flex: 1,
                    }}
                >
                    <Grid
                        container
                        spacing={1}
                        alignItems="center"
                    >
                        <Grid size={8}>
                            <Stack
                                direction="row"
                                spacing={1}
                            >
                                <Typography variant="h6">
                                    {todo.title}
                                </Typography>
                            </Stack>
                        </Grid>

                        <Grid
                            sx={{ ml: 'auto' }}
                        >
                            <Stack
                                direction="row"
                                alignItems="center"
                            >
                                <Icon>
                                    <EventIcon fontSize="small" />
                                </Icon>
                                <Typography>{todo.due_date ? timeFormat(todo.due_date) : '無期限'}</Typography>
                            </Stack>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </>
    );
};
