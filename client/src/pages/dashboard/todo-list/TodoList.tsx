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

import { Category } from '../../../types/category';
import { Todo } from '../../../types/todo';
import { Card } from '../components/Card';
import { TodoItem } from './components/TodoItem';

interface TodoListProps {
    todos: Todo[];
    onRefresh: () => void;
    categories: Category[];
    selectedCategory?: Category;
    onSelectedCategoryChange: (c?: Category) => void
}

export const TodoList = ({
    todos,
    onRefresh,
    categories,
    selectedCategory,
    onSelectedCategoryChange,
}: TodoListProps) => {

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
                        onClick={() => onRefresh()}
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
};