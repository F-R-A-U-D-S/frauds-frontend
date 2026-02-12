import axiosClient from "./axiosClient";

export interface ExportResponse {
    message: string;
}

/**
 * Request a secure asynchronous export.
 * @param format - The format of the file to export ('csv' or 'pdf').
 * @returns Promise resolving to the API response.
 */
export const requestExport = async (format: "csv" | "pdf"): Promise<ExportResponse> => {
    const response = await axiosClient.post<ExportResponse>(`/export/request?format=${format}`);
    return response.data;
};
