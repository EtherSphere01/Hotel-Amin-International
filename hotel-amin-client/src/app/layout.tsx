import type { Metadata } from "next";
import Script from "next/script";
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

                <Script
                    id="tawk-to-script"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: `
                            var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
                            (function(){
                                var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
                                s1.async=true;
                                s1.src='https://embed.tawk.to/662e59531ec1082f04e86728/1hsigprko';
                                s1.charset='UTF-8';
                                s1.setAttribute('crossorigin','*');
                                s0.parentNode.insertBefore(s1,s0);
                            })();
                        `,
                    }}
                />
            </body>
        </html>
    );
}
