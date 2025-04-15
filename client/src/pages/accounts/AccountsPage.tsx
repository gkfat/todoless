import { useRef } from 'react';

import { PageContainer } from '../../components/PageContainer';
import { AccountsTable } from './components/AccountsTable';
import { ControlPanel } from './components/ControlPanel';

export const AccountsPage = () => {
    const tableRef = useRef<{ refetch: () => void }>(null);
    
    const handleRefresh = () => {
        tableRef.current?.refetch();
    };

    return (
        <PageContainer>
            <ControlPanel onRefresh={handleRefresh} />
            <AccountsTable ref={tableRef} />
        </PageContainer>
    );
};

