import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import {
    Box,
    IconButton,
} from '@mui/material';

import { Todo } from '../../../../../../types/todo';

interface StarBoxProps {
    todo: Todo;
    bgColor: string;
    handleStarClick: () => void;
}

export const StarBox = (props: StarBoxProps) => {
    const {
        todo,
        bgColor,
        handleStarClick,
    } = props;

    return (
        <Box
            sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                width: '40px',
                backgroundColor: bgColor,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <IconButton
                onClick={handleStarClick}
                disableRipple
                sx={{
                    backgroundColor: 'transparent',
                    '&:hover': { backgroundColor: 'transparent' }, 
                }}
            >
                {
                    todo.starred
                        ? <StarIcon color="warning" />
                        : <StarBorderIcon />
                }
            </IconButton>
        </Box>
    );
};