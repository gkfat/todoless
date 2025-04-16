export interface Category {
    id: number;
    order: number;
    title: string;
    color?: string;
    
    create_at: string;
    update_at: string | null;
    deleted_at: string | null;
}