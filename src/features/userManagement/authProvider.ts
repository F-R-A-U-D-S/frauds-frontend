import type { AuthProvider } from "react-admin";

const authProvider: AuthProvider = {
    login: () => Promise.resolve(),
    logout: async () => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                await fetch("http://localhost:8000/auth/logout", {
                    method: "POST",
                    headers: { "Authorization": `Bearer ${token}` }
                });
                console.log("Logout API call successful");
            } catch (error) {
                console.error("Logout API call failed", error);
            }
        }
        localStorage.removeItem("token");
        localStorage.removeItem("is_admin");
        // Force full reload to clear AuthContext state and redirect
        window.location.assign("/login");
        return Promise.resolve();
    },
    checkAuth: () =>
        localStorage.getItem("token") ? Promise.resolve() : Promise.reject({ redirectTo: "/login" }),
    checkError: (error) => {
        const status = error.status;
        if (status === 401 || status === 403) {
            localStorage.removeItem("token");
            localStorage.removeItem("is_admin");
            window.location.assign("/login");
            return Promise.reject();
        }
        return Promise.resolve();
    },
    getPermissions: () =>
        localStorage.getItem("is_admin") === "true"
            ? Promise.resolve("admin")
            : Promise.resolve(""),
};

export default authProvider;
