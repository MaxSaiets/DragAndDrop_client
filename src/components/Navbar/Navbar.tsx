import { Link } from "react-router-dom";
import { MAINPAGE_ROUTE, USERPROFILE_ROUTE } from "../../consts/routePaths";
import { logout } from "../../store/user/userSlice";
import { useDispatch } from "react-redux";

const Navbar = () => {
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
    }

    return (
        <nav className="sticky top-0 z-100 bg-white shadow-sm">
            <div className="max-w-screen mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                            <p className="text-base md:text-xl font-bold text-gray-800">DragAndDone</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-1 md:space-x-4">
                        <Link 
                            to={MAINPAGE_ROUTE}
                            className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            Main
                        </Link>
                        <Link 
                            to={USERPROFILE_ROUTE}
                            className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            Profile
                        </Link>
                        <button 
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;