import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import { IconButton } from '@mui/material';

interface MenuButtonProps {
    onClick?: () => void;
}

export const MenuButton = ({ onClick }: MenuButtonProps) => {
    return (
        <IconButton
            size="small"
            onClick={onClick}
        >
            <MenuRoundedIcon />
        </IconButton>
    );
};
