import { Category } from '../types/category';
import { request } from './util/agent';

const agent = request('/api/v1/categories');

interface GetCategoryTodosRequest {
    categoryId: number;
}

interface CreateCategoryRequest {
    title: string;
    color?: string;
}

interface UpdateCategoryRequest {
    categoryId: number;
    title: string;
    color?: string;
}

interface SortCategoriesRequest {
    categories: {
        accountId: number;
        id: number;
        order: number;
    }[];
}

export const CategoryApi = {
    list: async (): Promise<Category[]> => {
        return agent({
            method: 'GET',
            url: '',
        });
    },

    create(data: CreateCategoryRequest): Promise<Category> {
        return agent({
            method: 'POST',
            url: '/create',
            data,
        });
    },
    
    update(data: UpdateCategoryRequest): Promise<Category> {
        return agent({
            method: 'PUT',
            url: `/${data.categoryId}/update`,
            data,
        });
    },

    delete(id: number) {
        return agent({
            method: 'DELETE',
            url: `/${id}`,
        });
    },

    sort(data: SortCategoriesRequest): Promise<Category[]> {
        return agent({
            method: 'POST',
            url: '/sort',
            data,
        });
    },
};