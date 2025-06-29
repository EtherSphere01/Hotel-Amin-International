"use client";

import type { Metadata } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { decodeJWT } from "@/app/utilities/jwt-operation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkAdminAccess = async () => {
            try {
                const user = decodeJWT();

                if (!user) {
                    toast.error("Please login to access this page");
                    router.push("/");
                    return;
                }

                if (user.role !== "admin") {
                    toast.error("Access denied. Admin privileges required.");
                    router.push("/");
                    return;
                }

                setIsAuthorized(true);
            } catch (error) {
                toast.error("Authentication error");
                router.push("/");
            } finally {
                setIsLoading(false);
            }
        };

        checkAdminAccess();
    }, [router]);

    if (isLoading) {
        return (
            <html lang="en">
                <body>
                    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B3C5D] mx-auto"></div>
                            <p className="mt-4 text-gray-600">
                                Checking permissions...
                            </p>
                        </div>
                    </div>
                    <ToastContainer />
                </body>
            </html>
        );
    }

    if (!isAuthorized) {
        return (
            <html lang="en">
                <body>
                    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                        <div className="text-center">
                            <p className="text-red-600">Access Denied</p>
                            <p className="mt-2 text-sm text-gray-500">
                                Redirecting to home page...
                            </p>
                        </div>
                    </div>
                    <ToastContainer />
                </body>
            </html>
        );
    }

    return (
        <html lang="en">
            <body>
                {children}
                <ToastContainer />
            </body>
        </html>
    );
}
