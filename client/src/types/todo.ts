import { Category } from './category';

export interface Todo {
    id: number;
    order: number;
    title: string;
    due_date?: string;
    completed_at: string | null;
    starred: boolean;

    category: Category | null;
    
    create_at: string;
    update_at: string | null;
    deleted_at: string | null;
}