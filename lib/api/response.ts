export interface APIResponse {
    status: number;
    message: string;
    error?: any;
    data?: any;
}