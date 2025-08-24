const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface DbUsageResponse {
    success: boolean;
    db_size: string; // formatted as "00.00 MB"
}

export const dbUsageService = {
    /**
     * Fetch the current database usage from the backend API
     */
    async getDbUsage(): Promise<DbUsageResponse> {
        try {
            const response = await fetch(`${API_BASE_URL}/db/usage`, {
                method: "GET",
                credentials: "include", // include cookies if using JWT in cookies
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to fetch database usage");
            }

            const data: DbUsageResponse = await response.json();
            return data;
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("Error fetching DB usage:", error.message);
                throw error;
            } else {
                console.error("Unknown error fetching DB usage:", error);
                throw new Error("An unknown error occurred");
            }
        }
    },
};
