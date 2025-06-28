import type { Metadata } from "next";
import "./globals.css";
import HeaderUser from "@/component/header-user";
import FooterUser from "@/component/footer-user";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const metadata: Metadata = {
    title: "Hotel Amin",
    description:
        "Hotel Amin international is a privately owned 3 Star Standard Luxury Hotel in Cox's Bazar Hotel, Bangladesh",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <HeaderUser></HeaderUser>
                {children}
                <FooterUser></FooterUser>
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
            </body>
        </html>
    );
}
