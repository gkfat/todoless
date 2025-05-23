import { Todo } from '../types/todo';
import { request } from './util/agent';

const agent = request('/api/v1/todos');

export interface GetTodosRequest {
    categoryId?: number;
}
interface CreateTodoRequest {
    title: string;
    categoryId: number;
    dueDate?: string;
}

interface UpdateTodoRequest {
    todoId: number;
    /**
     * 帶 -1 為未分類
     */
    categoryId?: number;
    title?: string;
    /**
     * 帶 null 為清空
     */
    dueDate?: string | null;
    starred?: boolean;
}

interface CompletedTodoRequest {
    todoId: number;
}

export const TodoApi = {
    list: async (data?: GetTodosRequest): Promise<Todo[]> => {
        return agent({
            method: 'GET',
            url: '',
            params: data,
        });
    },

    create(data: CreateTodoRequest): Promise<Todo> {
        return agent({
            method: 'POST',
            url: '/create',
            data,
        });
    },
    
    update(data: UpdateTodoRequest): Promise<Todo> {
        return agent({
            method: 'PUT',
            url: `/${data.todoId}/update`,
            data,
        });
    },

    completed(data: CompletedTodoRequest): Promise<Todo> {
        return agent({
            method: 'PUT',
            url: `/${data.todoId}/completed`,
            data,
        });
    },
   
    unCompleted(data: CompletedTodoRequest): Promise<Todo> {
        return agent({
            method: 'PUT',
            url: `/${data.todoId}/un-completed`,
            data,
        });
    },

    delete(id: number) {
        return agent({
            method: 'DELETE',
            url: `/${id}`,
        });
    },
};