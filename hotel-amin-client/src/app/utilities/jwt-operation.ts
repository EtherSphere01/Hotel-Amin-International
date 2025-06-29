import { jwtDecode } from "jwt-decode";

const getRole = (accessToken: string, refreshToken: string): string => {
    try {
        localStorage.setItem("accessToken", JSON.stringify(accessToken));
        localStorage.setItem("refreshToken", JSON.stringify(refreshToken));

        const decoded: any = jwtDecode(accessToken);
        return decoded?.role || "User";
    } catch (error) {
        console.error("Error decoding JWT:", error);
        return "User";
    }
};

const decodeJWT = (): any => {
    if (typeof window === "undefined") return null;
    const tokenString = localStorage.getItem("accessToken");
    if (!tokenString) return null;

    try {
        const token = JSON.parse(tokenString);

        const payload = JSON.parse(atob(token.split(".")[1]));

        const currentTime = Math.floor(Date.now() / 1000);
        if (payload.exp && currentTime > payload.exp) {
            return null;
        }
        return {
            id: Number(payload.sub),
            email: payload.email,
            role: payload.role,
            phone: payload.phone,
        };
    } catch (err) {
        return null;
    }
};

const singOut = async (): Promise<void> => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
};

const getToken = async (): Promise<string | null> => {
    if (typeof window === "undefined") return null;
    const token = localStorage.getItem("accessToken");
    return token ? JSON.parse(token) : null;
};

export { getRole, decodeJWT, singOut, getToken };
