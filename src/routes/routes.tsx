import { createBrowserRouter } from "react-router-dom";

import App from "../App";
import Dashboard from "../pages/DashboardPage";
import UserProfilePage from "../pages/UserProfilePage";

import WelcomePage from "../pages/WelcomePage";
import RequireAuth from "../components/Auth/RequireAuth";

import { DASHBOARD_ROUTE, MAIN_ROUTE, USERPROFILE_ROUTE, WELCOME_ROUTE } from "../consts/routePaths";


export const router = createBrowserRouter([
    {
        path: WELCOME_ROUTE,
        element: <WelcomePage />
    },
    {
        path: MAIN_ROUTE,
        element: (
            <RequireAuth>
                <App />
            </RequireAuth>
        ),
        children: [
            {path: DASHBOARD_ROUTE, element: <Dashboard />},
            {path: USERPROFILE_ROUTE, element: <UserProfilePage />},
        ]
    },
    {
        path: "*",
        element: <div>404</div>
    }
])