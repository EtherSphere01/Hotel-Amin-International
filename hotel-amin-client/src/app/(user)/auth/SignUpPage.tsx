"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { CheckCircle, Eye, EyeOff } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import { getRole } from "@/app/utilities/jwt-operation";
import { useRouter } from "next/navigation";

interface SignUpPageProps {
    onClose?: () => void;
    onSwitchToSignIn?: () => void;
    onAuthSuccess?: () => void;
}

export default function SignUpPage({
    onClose,
    onSwitchToSignIn,
    onAuthSuccess,
}: SignUpPageProps) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        address: "",
        nid: "",
        passport: "",
        nationality: "",
        profession: "",
        age: "",
        maritalStatus: false,
        vehicleNo: "",
        fatherName: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showPassword, setShowPassword] = useState(false);

    const router = useRouter();

    // Test function to check if backend is reachable

    const validateField = (name: string, value: string) => {
        const newErrors = { ...errors };

        switch (name) {
            case "name":
                if (value.length < 3) {
                    newErrors.name = "Name must be at least 3 characters";
                } else if (value.length > 100) {
                    newErrors.name = "Name must be less than 100 characters";
                } else {
                    delete newErrors.name;
                }
                break;
            case "email":
                if (value && value.length > 0) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(value)) {
                        newErrors.email = "Please enter a valid email address";
                    } else if (value.length > 100) {
                        newErrors.email =
                            "Email must be less than 100 characters";
                    } else {
                        delete newErrors.email;
                    }
                } else {
                    delete newErrors.email; // Email is optional
                }
                break;
            case "phone":
                // Bangladesh phone number validation: should be 11 digits for local format
                if (value.length < 11) {
                    newErrors.phone =
                        "Phone number must be at least 11 characters";
                } else if (value.length > 20) {
                    newErrors.phone =
                        "Phone number must be less than 20 characters";
                } else {
                    // Accept various BD formats: 01XXXXXXXXX, +8801XXXXXXXXX, 8801XXXXXXXXX
                    const cleanPhone = value.replace(/\s|-/g, "");
                    // More flexible regex that accepts different formats
                    const bdPhoneRegex = /^(\+?880|0)?1[0-9]\d{8}$/;
                    if (!bdPhoneRegex.test(cleanPhone)) {
                        newErrors.phone =
                            "Please enter a valid phone number (e.g., 01XXXXXXXXX or +8801XXXXXXXXX)";
                    } else {
                        delete newErrors.phone;
                    }
                }
                break;
            case "address":
                if (value.length < 5) {
                    newErrors.address = "Address must be at least 5 characters";
                } else if (value.length > 255) {
                    newErrors.address =
                        "Address must be less than 255 characters";
                } else {
                    delete newErrors.address;
                }
                break;
            case "nid":
                if (value.length < 5) {
                    newErrors.nid = "NID must be at least 5 characters";
                } else if (value.length > 50) {
                    newErrors.nid = "NID must be less than 50 characters";
                } else {
                    delete newErrors.nid;
                }
                break;
            case "passport":
                if (value && value.length > 0) {
                    if (value.length < 5) {
                        newErrors.passport =
                            "Passport must be at least 5 characters";
                    } else if (value.length > 50) {
                        newErrors.passport =
                            "Passport must be less than 50 characters";
                    } else {
                        delete newErrors.passport;
                    }
                } else {
                    delete newErrors.passport; // Passport is optional
                }
                break;
            case "nationality":
                if (value.length < 5) {
                    newErrors.nationality =
                        "Nationality must be at least 5 characters";
                } else if (value.length > 50) {
                    newErrors.nationality =
                        "Nationality must be less than 50 characters";
                } else {
                    delete newErrors.nationality;
                }
                break;
            case "profession":
                if (value.length < 5) {
                    newErrors.profession =
                        "Profession must be at least 5 characters";
                } else if (value.length > 50) {
                    newErrors.profession =
                        "Profession must be less than 50 characters";
                } else {
                    delete newErrors.profession;
                }
                break;
            case "fatherName":
                if (value.length < 5) {
                    newErrors.fatherName =
                        "Father's name must be at least 5 characters";
                } else if (value.length > 50) {
                    newErrors.fatherName =
                        "Father's name must be less than 50 characters";
                } else {
                    delete newErrors.fatherName;
                }
                break;
            case "vehicleNo":
                if (value && value.length > 0) {
                    if (value.length < 5) {
                        newErrors.vehicleNo =
                            "Vehicle number must be at least 5 characters";
                    } else if (value.length > 50) {
                        newErrors.vehicleNo =
                            "Vehicle number must be less than 50 characters";
                    } else {
                        delete newErrors.vehicleNo;
                    }
                } else {
                    delete newErrors.vehicleNo; // Vehicle number is optional
                }
                break;
            case "age":
                const ageNum = parseInt(value);
                if (isNaN(ageNum) || ageNum < 0) {
                    newErrors.age = "Age must be a positive number";
                } else if (ageNum > 120) {
                    newErrors.age = "Age must be less than 120";
                } else {
                    delete newErrors.age;
                }
                break;
            default:
                break;
        }

        setErrors(newErrors);
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        const newValue =
            type === "checkbox"
                ? (e.target as HTMLInputElement).checked
                : value;

        setFormData((prev) => ({
            ...prev,
            [name]: newValue,
        }));

        // Validate field on change
        if (type !== "checkbox") {
            validateField(name, value);
        }
    };

    const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Additional validation before submission
        const ageValue = parseInt(formData.age);
        if (isNaN(ageValue) || ageValue < 18 || ageValue > 120) {
            toast.error("Please enter a valid age between 18 and 120");
            return;
        }

        // Prepare the data payload
        const userData: any = {
            name: formData.name.trim(),
            password: formData.password,
            phone: formData.phone.trim(),
            address: formData.address.trim(),
            nid: formData.nid.trim(),
            nationality: formData.nationality.trim(),
            profession: formData.profession.trim(),
            age: parseInt(formData.age),
            maritalStatus: formData.maritalStatus,
            fatherName: formData.fatherName.trim(),
        };

        // Only include optional fields if they have valid values
        if (formData.email.trim()) {
            userData.email = formData.email.trim();
        }

        // Include passport and vehicleNo with default values if empty (database constraint)
        userData.passport = formData.passport.trim() || "Not Available";
        userData.vehicleNo = formData.vehicleNo.trim() || "Not Available";

        console.log("Sending user data:", userData);
        console.log("Data types:", {
            name: typeof userData.name,
            email: typeof userData.email,
            password: typeof userData.password,
            phone: typeof userData.phone,
            address: typeof userData.address,
            nid: typeof userData.nid,
            passport: typeof userData.passport,
            nationality: typeof userData.nationality,
            profession: typeof userData.profession,
            age: typeof userData.age,
            maritalStatus: typeof userData.maritalStatus,
            vehicleNo: typeof userData.vehicleNo,
            fatherName: typeof userData.fatherName,
        });

        // Use environment variable or fallback to localhost
        const baseURL =
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
        const endpoint = `${baseURL}/user/createUser`;

        console.log("API Endpoint:", endpoint);
        console.log("Sending user data:", userData);

        try {
            const response = await axios.post(endpoint, userData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            console.log("API Response:", response.data);
            console.log("API Status:", response.status);

            if (response.status === 201 || response.status === 200) {
                console.log("Signup successful, calling callbacks...");

                // Show success message first
                toast.success(
                    "Account created successfully! Welcome email has been sent."
                );

                // Reset form on success
                setFormData({
                    name: "",
                    email: "",
                    password: "",
                    phone: "",
                    address: "",
                    nid: "",
                    passport: "",
                    nationality: "",
                    profession: "",
                    age: "",
                    maritalStatus: false,
                    vehicleNo: "",
                    fatherName: "",
                });

                // Clear any existing errors
                setErrors({});

                // Call auth success callback if provided (this should hide signup/signin buttons)
                if (onAuthSuccess) {
                    console.log("Calling onAuthSuccess callback");
                    setTimeout(() => onAuthSuccess(), 500);
                }

                // Close modal if onClose prop is provided
                if (onClose) {
                    console.log("Calling onClose callback");
                    setTimeout(() => onClose(), 1000);
                }

                // Navigate to signin page or home after a delay
                setTimeout(() => {
                    if (onSwitchToSignIn) {
                        onSwitchToSignIn();
                    } else {
                        router.push("/");
                    }
                }, 1500);
            } else {
                console.log("Unexpected response status:", response.status);
                toast.error(response.data?.message || "Sign up failed");
            }
        } catch (err: any) {
            console.error("Signup error:", err);
            console.error("Error response:", err.response);
            console.error("Error response data:", err.response?.data);
            console.error("Error response status:", err.response?.status);
            console.error("Error message:", err.message);

            let errorMessage = "Failed to create account";

            if (err.code === "ECONNREFUSED" || err.code === "ERR_NETWORK") {
                errorMessage =
                    "Cannot connect to server. Please check if the backend is running on http://localhost:3000";
            } else if (err.response) {
                // Server responded with error status
                console.log("Server error details:", {
                    status: err.response.status,
                    statusText: err.response.statusText,
                    data: err.response.data,
                    headers: err.response.headers,
                });

                if (err.response.status === 400) {
                    // Parse validation errors from backend
                    if (err.response.data?.message) {
                        if (Array.isArray(err.response.data.message)) {
                            // Multiple validation errors
                            const validationErrors =
                                err.response.data.message.join(", ");
                            errorMessage = `Validation Error: ${validationErrors}`;
                        } else if (
                            err.response.data.message.includes(
                                "User already exists"
                            )
                        ) {
                            errorMessage =
                                "An account with this email or phone already exists";
                        } else {
                            errorMessage = err.response.data.message;
                        }
                    } else if (err.response.data?.error) {
                        errorMessage = err.response.data.error;
                    } else {
                        errorMessage =
                            "Invalid data format - please check all fields";
                    }
                } else if (err.response.status === 409) {
                    errorMessage =
                        "An account with this email or phone already exists";
                } else {
                    errorMessage =
                        err.response.data?.message ||
                        err.response.statusText ||
                        `Server error: ${err.response.status}`;
                }
            } else if (err.request) {
                // Request was made but no response received
                errorMessage =
                    "No response from server. Please check your network connection.";
            } else {
                // Something else happened
                errorMessage = err.message || "Unknown error occurred";
            }

            toast.error(errorMessage);
        }
    };

    const passwordValidations = [
        {
            label: "At least 8 characters",
            isValid: formData.password.length >= 8,
        },
        {
            label: "1 uppercase letter",
            isValid: /[A-Z]/.test(formData.password),
        },
        {
            label: "1 lowercase letter",
            isValid: /[a-z]/.test(formData.password),
        },
        {
            label: "1 number",
            isValid: /\d/.test(formData.password),
        },
        {
            label: "1 special character",
            isValid: /[!@#$%^&*(),.?\":{}|<>]/.test(formData.password),
        },
    ];

    const isPasswordValid = passwordValidations.every((rule) => rule.isValid);
    const areRequiredFieldsFilled =
        formData.name &&
        formData.password &&
        formData.phone &&
        formData.address &&
        formData.nid &&
        formData.nationality &&
        formData.profession &&
        formData.age &&
        formData.fatherName;
    const hasNoErrors = Object.keys(errors).length === 0;
    const isFormValid =
        isPasswordValid && areRequiredFieldsFilled && hasNoErrors;

    return (
        <div className="w-full max-h-[80vh] overflow-y-auto">
            <div className="w-full bg-white p-4">
                <h1 className="text-3xl text-gray-800 font-semibold mb-4">
                    Sign Up
                </h1>

                <p className="mb-6 text-gray-600 flex justify-start gap-3">
                    Already have an account?
                    <span
                        className="text-blue-600 underline hover:cursor-pointer"
                        onClick={() => {
                            if (onSwitchToSignIn) {
                                onSwitchToSignIn();
                            } else {
                                window.location.href = "/signin";
                            }
                        }}
                    >
                        Sign in
                    </span>
                </p>
                <form className="space-y-4" onSubmit={handleOnSubmit}>
                    {/* Personal Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label
                                htmlFor="name"
                                className="block font-medium text-gray-800 mb-2"
                            >
                                Full Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                placeholder="e.g. John Doe"
                                required
                                value={formData.name}
                                onChange={handleInputChange}
                                className={`w-full border rounded-md p-3 focus:outline-none focus:ring-2 text-gray-900 placeholder-gray-400 ${
                                    errors.name
                                        ? "border-red-500 focus:ring-red-500"
                                        : "border-gray-300 focus:ring-blue-500"
                                }`}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="email"
                                className="block font-medium text-gray-800 mb-2"
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                placeholder="your@email.com "
                                value={formData.email}
                                onChange={handleInputChange}
                                className={`w-full border rounded-md p-3 focus:outline-none focus:ring-2 text-gray-900 placeholder-gray-400 ${
                                    errors.email
                                        ? "border-red-500 focus:ring-red-500"
                                        : "border-gray-300 focus:ring-blue-500"
                                }`}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.email}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label
                                htmlFor="phone"
                                className="block font-medium text-gray-800 mb-2"
                            >
                                Phone *
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                placeholder="01XXXXXXXXX or +8801XXXXXXXXX"
                                required
                                value={formData.phone}
                                onChange={handleInputChange}
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
                            <p className="text-xs text-gray-500 mt-1"></p>
                        </div>

                        <div>
                            <label
                                htmlFor="age"
                                className="block font-medium text-gray-800 mb-2"
                            >
                                Age *
                            </label>
                            <input
                                type="number"
                                name="age"
                                placeholder="25"
                                required
                                min="18"
                                max="100"
                                value={formData.age}
                                onChange={handleInputChange}
                                className={`w-full border rounded-md p-3 focus:outline-none focus:ring-2 text-gray-900 placeholder-gray-400 ${
                                    errors.age
                                        ? "border-red-500 focus:ring-red-500"
                                        : "border-gray-300 focus:ring-blue-500"
                                }`}
                            />
                            {errors.age && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.age}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="address"
                            className="block font-medium text-gray-800 mb-2"
                        >
                            Address *
                        </label>
                        <input
                            type="text"
                            name="address"
                            placeholder="Your full address "
                            required
                            value={formData.address}
                            onChange={handleInputChange}
                            className={`w-full border rounded-md p-3 focus:outline-none focus:ring-2 text-gray-900 placeholder-gray-400 ${
                                errors.address
                                    ? "border-red-500 focus:ring-red-500"
                                    : "border-gray-300 focus:ring-blue-500"
                            }`}
                        />
                        {errors.address && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.address}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label
                                htmlFor="nid"
                                className="block font-medium text-gray-800 mb-2"
                            >
                                NID *
                            </label>
                            <input
                                type="text"
                                name="nid"
                                placeholder="National ID Number "
                                required
                                value={formData.nid}
                                onChange={handleInputChange}
                                className={`w-full border rounded-md p-3 focus:outline-none focus:ring-2 text-gray-900 placeholder-gray-400 ${
                                    errors.nid
                                        ? "border-red-500 focus:ring-red-500"
                                        : "border-gray-300 focus:ring-blue-500"
                                }`}
                            />
                            {errors.nid && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.nid}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="passport"
                                className="block font-medium text-gray-800 mb-2"
                            >
                                Passport
                            </label>
                            <input
                                type="text"
                                name="passport"
                                placeholder="Passport Number "
                                value={formData.passport}
                                onChange={handleInputChange}
                                className={`w-full border rounded-md p-3 focus:outline-none focus:ring-2 text-gray-900 placeholder-gray-400 ${
                                    errors.passport
                                        ? "border-red-500 focus:ring-red-500"
                                        : "border-gray-300 focus:ring-blue-500"
                                }`}
                            />
                            {errors.passport && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.passport}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label
                                htmlFor="nationality"
                                className="block font-medium text-gray-800 mb-2"
                            >
                                Nationality *
                            </label>
                            <input
                                type="text"
                                name="nationality"
                                placeholder="e.g. Bangladeshi"
                                required
                                value={formData.nationality}
                                onChange={handleInputChange}
                                className={`w-full border rounded-md p-3 focus:outline-none focus:ring-2 text-gray-900 placeholder-gray-400 ${
                                    errors.nationality
                                        ? "border-red-500 focus:ring-red-500"
                                        : "border-gray-300 focus:ring-blue-500"
                                }`}
                            />
                            {errors.nationality && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.nationality}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="profession"
                                className="block font-medium text-gray-800 mb-2"
                            >
                                Profession *
                            </label>
                            <input
                                type="text"
                                name="profession"
                                placeholder="e.g. Teacher"
                                required
                                value={formData.profession}
                                onChange={handleInputChange}
                                className={`w-full border rounded-md p-3 focus:outline-none focus:ring-2 text-gray-900 placeholder-gray-400 ${
                                    errors.profession
                                        ? "border-red-500 focus:ring-red-500"
                                        : "border-gray-300 focus:ring-blue-500"
                                }`}
                            />
                            {errors.profession && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.profession}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="fatherName"
                            className="block font-medium text-gray-800 mb-2"
                        >
                            Father's Name *
                        </label>
                        <input
                            type="text"
                            name="fatherName"
                            placeholder="Father's full name"
                            required
                            value={formData.fatherName}
                            onChange={handleInputChange}
                            className={`w-full border rounded-md p-3 focus:outline-none focus:ring-2 text-gray-900 placeholder-gray-400 ${
                                errors.fatherName
                                    ? "border-red-500 focus:ring-red-500"
                                    : "border-gray-300 focus:ring-blue-500"
                            }`}
                        />
                        {errors.fatherName && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.fatherName}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label
                                htmlFor="vehicleNo"
                                className="block font-medium text-gray-800 mb-2"
                            >
                                Vehicle Number
                            </label>
                            <input
                                type="text"
                                name="vehicleNo"
                                placeholder="Vehicle registration number"
                                value={formData.vehicleNo}
                                onChange={handleInputChange}
                                className={`w-full border rounded-md p-3 focus:outline-none focus:ring-2 text-gray-900 placeholder-gray-400 ${
                                    errors.vehicleNo
                                        ? "border-red-500 focus:ring-red-500"
                                        : "border-gray-300 focus:ring-blue-500"
                                }`}
                            />
                            {errors.vehicleNo && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.vehicleNo}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center pt-8">
                            <input
                                type="checkbox"
                                name="maritalStatus"
                                checked={formData.maritalStatus}
                                onChange={handleInputChange}
                                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label
                                htmlFor="maritalStatus"
                                className="text-gray-800 font-medium"
                            >
                                Married
                            </label>
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block font-medium text-gray-800 mb-2"
                        >
                            Password *
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Enter your password"
                                required
                                value={formData.password}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 text-gray-900 placeholder-gray-400 pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                        <ul className="text-sm mt-2 ml-1 space-y-1">
                            {passwordValidations.map((rule, idx) => (
                                <li
                                    key={idx}
                                    className="flex items-center gap-2 text-gray-700"
                                >
                                    <span
                                        className={`h-4 w-4 rounded-full flex items-center justify-center ${
                                            rule.isValid
                                                ? "text-green-600"
                                                : "text-gray-400"
                                        }`}
                                    >
                                        {rule.isValid ? (
                                            <CheckCircle className="w-4 h-4" />
                                        ) : (
                                            "•"
                                        )}
                                    </span>
                                    <span
                                        className={
                                            rule.isValid
                                                ? "text-green-600"
                                                : "text-red-600"
                                        }
                                    >
                                        {rule.label}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <button
                        type="submit"
                        disabled={!isFormValid}
                        className={`w-full text-white py-3 rounded-md transition font-semibold ${
                            isFormValid
                                ? "bg-[#F5A623] hover:bg-[#e49b1a]"
                                : "bg-gray-400 cursor-not-allowed"
                        }`}
                    >
                        Sign Up
                    </button>
                </form>
            </div>
        </div>
    );
}
