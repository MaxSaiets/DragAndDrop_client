import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser, loginWithGoogle, loginWithGitHub } from "../../../store/user/userSlice";
import { checkAuth } from "../../../fireBase/authServices";
import { logout } from "../../../store/user/userSlice";
import type { RootState, AppDispatch} from "../../../store/store";
import LoadingSpinner from "../../Spinner/LoadingSpinner";

interface AuthPopupProps {
    onClose: () => void;
}

const AuthPopup = ({ onClose }: AuthPopupProps) => {
    const loginStatus = useSelector((state: RootState) => state.user.status);
    const dispatch = useDispatch<AppDispatch>();

    const [logOrReg, setLogOrReg] = useState<"login" | "register">("login");

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleLogin = async () => {
        if (!email || !password) {
            setErrorMessage("Please fill in all fields");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setErrorMessage("Please enter a valid email address");
            return;
        }
        if (password.length < 6) {
            setErrorMessage("Password should be at least 6 characters");
            return;
        }
        setErrorMessage(null);
        try {
            await dispatch(loginUser({ email, password })).unwrap();
        } catch (err: unknown) {
            if (typeof err === "string") setErrorMessage(err);
            else if (err && typeof err === "object" && "message" in err) setErrorMessage((err as { message: string }).message);
            else setErrorMessage("Login failed");
        }
    };
    const handleRegister = async () => {
        if (!email || !password) {
            setErrorMessage("Please fill in all fields");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setErrorMessage("Please enter a valid email address");
            return;
        }
        if (password.length < 6) {
            setErrorMessage("Password should be at least 6 characters");
            return;
        }
        setErrorMessage(null);
        try {
            await dispatch(registerUser({ email, password })).unwrap();
        } catch (err: unknown) {
            if (typeof err === "string") setErrorMessage(err);
            else if (err && typeof err === "object" && "message" in err) setErrorMessage((err as { message: string }).message);
            else setErrorMessage("Registration failed");
        }
    };

    const handleLogout = async () => {
        dispatch(logout());
      };

    const handleGoogleAuth = () => {
        const allowAuth = checkAuth(loginStatus.login, handleLogout);
        if(!allowAuth){
            return;
        }
        dispatch(loginWithGoogle());
    };
    const handleGitHubAuth = () => {
        const allowAuth = checkAuth(loginStatus.login, handleLogout);
        if(!allowAuth){
            return;
        }
        dispatch(loginWithGitHub());
    };
    
    const handleLogOrReg = () => {
        setLogOrReg(prevLogOrReg => prevLogOrReg === "login" ? "register" : "login");
        setErrorMessage(null);
    };

    const isLoading = loginStatus.login === "loading" || loginStatus.fetch === "loading";

    return (
        <>
            {isLoading && <LoadingSpinner className="z-9999 fixed inset-0 bg-[rgba(255,255,255,0.4)]" />}
            
            <div onClick={onClose} className="h-[100dvh] fixed inset-0 flex flex-col items-center justify-center backdrop-blur-sm bg-opacity-50 z-100 animate-fadeIn" 
                style={{
                    animation: 'fadeIn 0.4s ease-in-out',
                    animationFillMode: 'forwards'
                }}
            >
                <div onClick={(e) => e.stopPropagation()} className="max-w-[95vw] flex flex-col items-center justify-center bg-white rounded-xl shadow-lg p-4 w-full md:max-w-md bg-gradient-to-r from-green-200 to-green-400">
                    <div className="flex flex-col w-full items-center justify-center">
                        <div className="flex justify-end w-full">
                            <button onClick={onClose}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex flex-col w-full items-center justify-center">
                            <div className="text-xl font-bold mb-4">
                                {logOrReg === "login" ? <h1>Login</h1> : <h1>Register</h1>}
                            </div>
                            <div className="min-w-[70%] flex flex-col gap-4">
                                <input 
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="px-4 py-2 rounded-lg border-1 border-gray-400 focus:outline-none focus:border-gray-700"
                                />
                                <input 
                                    type="password"
                                    placeholder="Password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="px-4 py-2 rounded-lg border-1 border-gray-400 focus:outline-none focus:border-gray-700"
                                />
                                <button className="min-w-[50%] bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                                    onClick={logOrReg === "login" ? handleLogin : handleRegister}
                                >
                                    {logOrReg === "login" ? "Login" : "Register"}
                                </button>
                            </div>
                        </div>

                        <div className="text-sm text-gray-500 my-2 text-center justify-center">
                            {errorMessage && (
                                <div className="text-red-600 text-sm mt-2">{errorMessage}</div>
                            )}
                            <button onClick={handleLogOrReg} className="mx-auto">
                                {logOrReg === "login" ? (
                                    <>
                                        Don't have an account? 
                                        <span className="text-gray-500 underline font-semibold cursor-pointer"> Register</span> 
                                    </>
                                ) : (
                                    <>
                                        Already have an account?{" "}
                                        <span className="text-gray-500 underline font-semibold cursor-pointer">Login</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-row gap-2 justify-center items-center">
                        <p>Or {logOrReg === "login" ? "continue with" : "sign up with"}</p>
                        
                        <button onClick={handleGoogleAuth} className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                            <svg className="size-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                            Google
                        </button>
                        
                        <button onClick={handleGitHubAuth} className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                            <svg className="size-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 1.27a11 11 0 00-3.48 21.46c.55.09.73-.24.73-.53v-1.85c-3.03.66-3.67-1.45-3.67-1.45-.5-1.27-1.21-1.6-1.21-1.6-.99-.67.07-.66.07-.66 1.09.08 1.67 1.12 1.67 1.12.97 1.66 2.54 1.18 3.16.9.1-.7.38-1.18.69-1.45-2.42-.27-4.96-1.21-4.96-5.4 0-1.19.42-2.17 1.12-2.93-.11-.28-.49-1.39.11-2.89 0 0 .92-.3 3 1.12a10.5 10.5 0 015.52 0c2.08-1.42 3-1.12 3-1.12.6 1.5.22 2.61.11 2.89.7.76 1.12 1.74 1.12 2.93 0 4.2-2.55 5.13-4.98 5.4.39.34.74 1 .74 2.02v3c0 .29.19.63.74.53A11 11 0 0012 1.27" fill="black"/>
                            </svg>
                            GitHub
                        </button>
                    </div>
                </div>

            </div>
        </>
    )
}

export default AuthPopup;