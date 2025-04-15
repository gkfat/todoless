import { useTranslation } from 'react-i18next';

import { Paper } from '@mui/material';
import {
    DataGrid,
    GridColDef,
    GridValidRowModel,
} from '@mui/x-data-grid';
import {
    enUS,
    zhTW,
} from '@mui/x-data-grid/locales';

type AppDataGridProps<T extends GridValidRowModel> = {
    columns: GridColDef<T>[];
    rows: T[];
    loading?: boolean;
  };
  
export const AppDataGrid = <T extends GridValidRowModel>({
    columns, rows, loading = false,
}: AppDataGridProps<T>) => {
    const { i18n } = useTranslation();
  
    const localeMap = {
        en: enUS.components.MuiDataGrid.defaultProps.localeText,
        zh: zhTW.components.MuiDataGrid.defaultProps.localeText,
    };
  
    const currentLocaleText =
      localeMap[i18n.language as keyof typeof localeMap] ?? enUS.components.MuiDataGrid.defaultProps.localeText;
  
    return (
        <Paper>
            <DataGrid
                rows={rows}
                columns={columns}
                loading={loading}
                getRowHeight={() => 'auto'}
                localeText={currentLocaleText}
                autosizeOptions={{
                    includeHeaders: true,
                    includeOutliers: true,
                    outliersFactor: 1,
                    expand: true,
                }}
                sx={{
                    '& .MuiDataGrid-cell': {
                        display: 'flex',
                        alignItems: 'center',
                        whiteSpace: 'normal',
                        wordBreak: 'break-word',
                    },
                }}
            />
        </Paper>
    );
};