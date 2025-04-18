import {
    useEffect,
    useState,
} from 'react';

import FactCheckIcon from '@mui/icons-material/FactCheckRounded';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
    CardContent,
    Icon,
    IconButton,
    MenuItem,
    Paper,
    Select,
    SelectChangeEvent,
    Stack,
    Typography,
} from '@mui/material';

import { Category } from '../../../types/category';
import { Todo } from '../../../types/todo';
import { Card } from '../components/Card';
import { AddTodo } from './components/AddTodo';
import { TodoItem } from './components/TodoItem';

interface TodoListProps {
    todos: Todo[];
    isLoading: boolean;
    categories: Category[];
    onRefresh: () => void;
    selectedCategory?: Category;
    onSelectedCategoryChange: (c?: Category) => void
}

export const TodoList = ({
    todos,
    categories,
    isLoading,
    onRefresh,
    selectedCategory,
    onSelectedCategoryChange,
}: TodoListProps) => {
    const [selectedCategoryId, setSelectedCategoryId] = useState<number>(-1);

    useEffect(() => {
        setSelectedCategoryId(selectedCategory?.id ?? -1);
    }, [selectedCategory]);

    const handleSelectCategoryChange = (e: SelectChangeEvent<{value: number}>) => {
        const id = e.target.value as number;

        setSelectedCategoryId(id);

        const findCategory = categories.find((c) => c.id === id);
        onSelectedCategoryChange(findCategory ?? undefined);
    };

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
                        mb: 2,
                    }}
                >
                    <Icon>
                        <FactCheckIcon />
                    </Icon>

                    <Typography
                        variant="h5"
                        sx={{ mr: 'auto' }}
                    >
                        待辦
                    </Typography>

                    <Icon>
                        <FilterAltIcon />
                    </Icon>
                    <Select
                        value={selectedCategoryId}
                        displayEmpty
                        sx={{ borderRadius: '15px' }}
                        onChange={handleSelectCategoryChange}
                    >
                        <MenuItem value={-1}>全部</MenuItem>
                        
                        {categories.map((c) => (
                            <MenuItem value={c.id}>{c.title}</MenuItem>
                        ))}
                    </Select>

                    <IconButton
                        onClick={() => onRefresh()}
                    >
                        <RefreshIcon />
                    </IconButton>
                </Stack>

                <Stack
                    direction="row"
                    sx={{ mb: 2 }}
                >
                    <AddTodo
                        categories={categories}
                        onRefresh={onRefresh}
                    />
                </Stack>
                    
                <Stack
                    direction="row"
                    flexWrap="wrap"
                    gap={1}
                >
                    {isLoading && (
                        <Typography>Loading...</Typography>
                    )}

                    {!isLoading && !todos.length && (
                        <Typography>沒有待辦。</Typography>
                    )}

                    {todos.map((todo) => (
                        <Paper
                            key={todo.id}
                            sx={{ width: '100%' }}
                        >
                            <TodoItem
                                todo={todo}
                            />
                        </Paper>
                    ))}
                </Stack>
            </CardContent>
        </Card>
    );
};