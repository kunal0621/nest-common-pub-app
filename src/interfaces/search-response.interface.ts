export interface SearchResponse<T> {
    items: T[];
    total: number;
    page: number;
    count: number;
    totalPages: number;
}