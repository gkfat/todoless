import { useDispatch } from 'react-redux';

import { useQuery } from '@tanstack/react-query';

import { AccountApi } from '../../api/accounts';
import { PageContainer } from '../../components/PageContainer';

const AccountsList = () => {
    const dispatch = useDispatch();

    const {
        data: accounts,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ['accounts', 'list'],
        queryFn: AccountApi.list,
        refetchOnMount: true,
    });

    if (isLoading) {
        return (
            <div>is loading...</div>
        );
    }

    console.log(accounts);
    
    return (
        <div>
           accounts
        </div>
    );
};

export const AccountsPage = () => {
    return (
        <PageContainer>
            <AccountsList />
        </PageContainer>
    );
};

