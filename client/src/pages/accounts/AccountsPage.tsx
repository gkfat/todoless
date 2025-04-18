import { useRef } from 'react';

import { useTranslation } from 'react-i18next';

import { ControlPanel } from '../../components/ControlPanel';
import { PageContainer } from '../../components/PageContainer';
import { AccountsTable } from './components/AccountsTable';

export const AccountsPage = () => {
    const { t } = useTranslation();
    const tableRef = useRef<{ refetch: () => void }>(null);
    
    const handleRefresh = () => {
        tableRef.current?.refetch();
    };

    return (
        <PageContainer>
            <ControlPanel
                title={t('view_accounts.title')}
                onRefresh={handleRefresh}
            />
            <AccountsTable ref={tableRef} />
        </PageContainer>
    );
};

