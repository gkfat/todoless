import {
    useEffect,
    useState,
} from 'react';

import { useTranslation } from 'react-i18next';

import {
    FormControl,
    MenuItem,
    Select,
    SelectChangeEvent,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';

import { CategoryApi } from '../api/categories';

export const CategorySelector = () => {
    const { t } = useTranslation();
    const [categoryId, setCategoryId] = useState<number>();

    const { data: categories } = useQuery({
        queryKey: ['categories', 'list'],
        queryFn: CategoryApi.list,
        refetchOnMount: true,
    });

    useEffect(() => {
        if (categories && categories.length > 0) {
            setCategoryId(categories[0].id);
        }
    }, [categories]);

    const handleChange = (event: SelectChangeEvent<number | undefined>) => {
        const v = event.target.value;

        if (Number.isFinite(v)) {
            setCategoryId(v as number);
        }
    };

    return (
        <FormControl fullWidth>
            <Select
                label={t('common.label_category')}
                onChange={handleChange}
                disabled={!categories || !categories.length}
                displayEmpty
            >
                <MenuItem
                    disabled
                >
                    {t('common.label_please_select_category')}
                </MenuItem>

                {(categories ?? []).map((category) => {
                    return (
                        <MenuItem
                            key={category.id}
                            value={category.id}
                        >{category.title}</MenuItem>
                    );
                })}
            </Select>
        </FormControl>
    );
};