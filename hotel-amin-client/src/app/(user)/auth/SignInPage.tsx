"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import { decodeJWT, getRole } from "@/app/utilities/jwt-operation";
import { useRouter } from "next/navigation";

interface SignInPageProps {
    onClose?: () => void;
    onSwitchToSignUp?: () => void;
    onAuthSuccess?: () => void;
}

export default function SignInPage({
    onClose,
    onSwitchToSignUp,
    onAuthSuccess,
}: SignInPageProps) {
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const validatePhone = (phone: string) => {
        const bdPhoneRegex = /^(\+880|880|0)?1[3-9]\d{8}$/;
        if (!bdPhoneRegex.test(phone.replace(/\s|-/g, ""))) {
            setErrors((prev) => ({
                ...prev,
                phone: "Enter a valid phone number (e.g., +8801XXXXXXXXX)",
            }));
        } else {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.phone;
                return newErrors;
            });
        }
    };

    const validatePassword = (password: string) => {
        if (password.length < 8) {
            setErrors((prev) => ({
                ...prev,
                password: "Password must be at least 8 characters",
            }));
        } else {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.password;
                return newErrors;
            });
        }
    };

    const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        await toast.promise(
            (async () => {
                try {
                    const res = await axios.post(
                        `http://localhost:3000/auth/signin`,
                        { phone, password }
                    );
                    const { data } = res;

                    if (data?.accessToken) {
                        const role = getRole(
                            data.accessToken,
                            data.refreshToken
                        );
                        setPhone("");
                        setPassword("");
                        const user = decodeJWT();
                        // const signedInUser = {
                        //   id: user.user_id,
                        //   role: user.role,
                        //   email: user.email,
                        //   full_name: user.full_name,
                        // };
                        setUser(user);

                        // Close modal if onClose prop is provided
                        if (onClose) {
                            onClose();
                        }

                        // Call auth success callback
                        if (onAuthSuccess) {
                            onAuthSuccess();
                        }

                        if (role === "admin") {
                            router.push("/");
                        } else {
                            router.push("/");
                        }
                    } else {
                        toast.error(data?.message || "Login failed");
                        return;
                    }
                } catch (err: any) {
                    const message =
                        err.response?.data?.message || "Login failed";
                    toast.error(message);
                }
            })(),
            {
                pending: "Signing in...",
                error: {
                    render({ data }: any) {
                        return (
                            data?.message || data?.toString() || "Login failed"
                        );
                    },
                },
            }
        );
    };

    return (
        <div className="w-full">
            <div className="w-full">
                <div className="w-full bg-white p-4">
                    <h1 className="text-3xl text-gray-800 font-semibold mb-4">
                        Sign in
                    </h1>
                    <p className="mb-6 text-gray-600 flex justify-start gap-3">
                        New User?
                        <span
                            className="text-blue-600 underline hover:cursor-pointer"
                            onClick={() => {
                                if (onSwitchToSignUp) {
                                    onSwitchToSignUp();
                                } else {
                                    window.location.href = "/signup";
                                }
                            }}
                        >
                            Create an account
                        </span>
                    </p>
                    <form className="space-y-6" onSubmit={handleOnSubmit}>
                        <div>
                            <label
                                htmlFor="phone"
                                className="block font-medium text-gray-800 mb-2"
                            >
                                Phone
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                placeholder="enter your phone number"
                                required
                                value={phone}
                                onChange={(e) => {
                                    setPhone(e.target.value);
                                    validatePhone(e.target.value);
                                }}
                                className={`w-full border rounded-md p-3 focus:outline-none focus:ring-2 text-gray-900 placeholder-gray-400 ${
                                    errors.phone
                                        ? "border-red-500 focus:ring-red-500"
                                        : "border-gray-300 focus:ring-blue-500"
                                }`}
                            />
                            {errors.phone && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.phone}
                                </p>
                            )}
                        </div>
                        <div>
                            <label
                                htmlFor="password"
                                className="block font-medium text-gray-800 mb-2"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="enter your password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        validatePassword(e.target.value);
                                    }}
                                    className={`w-full border rounded-md p-3 focus:outline-none focus:ring-2 text-gray-900 placeholder-gray-400 pr-10 ${
                                        errors.password
                                            ? "border-red-500 focus:ring-red-500"
                                            : "border-gray-300 focus:ring-blue-500"
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.password}
                                </p>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={
                                Object.keys(errors).length > 0 ||
                                !phone ||
                                !password
                            }
                            className={`w-full py-3 rounded-md transition font-semibold ${
                                Object.keys(errors).length > 0 ||
                                !phone ||
                                !password
                                    ? "bg-gray-400 cursor-not-allowed text-white"
                                    : "bg-[#F5A623] text-white hover:bg-[#e49b1a]"
                            }`}
                        >
                            Sign In
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
