import { ApiResponse } from "./apiResponse.class";
export interface ApiMessage {
    message: string;
}

export type ApiMessageResponse = ApiResponse<ApiMessage>;
