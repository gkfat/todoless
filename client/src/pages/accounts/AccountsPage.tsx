import { useDispatch } from 'react-redux';

import { useQuery } from '@tanstack/react-query';

import { AccountApi } from '../../api/accounts';

export const AccountsPage = () => {
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