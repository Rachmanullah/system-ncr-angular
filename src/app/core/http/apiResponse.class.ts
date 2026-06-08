export interface ApiResponse<T> {
    success: boolean;
    code: number;
    message: string;
    server: string;
    data: T;
}
