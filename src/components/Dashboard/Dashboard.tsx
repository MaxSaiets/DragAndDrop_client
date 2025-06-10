import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import { fetchTasks } from "../../store/task/taskSlice";
import { Board } from "./Board";
import LoadingSpinner from "../Spinner/LoadingSpinner";

const Dashboard = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error, tasks } = useSelector((state: RootState) => state.task);

    useEffect(() => {
        const loadTasks = async () => {
            if (tasks.length === 0) {
                try {
                    await dispatch(fetchTasks()).unwrap();
                } catch (err) {
                    console.error("Error loading tasks:", err);
                }
            }
        };

        loadTasks();
    }, [dispatch, tasks.length]);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <div className="flex h-full items-center justify-center text-red-500">{error}</div>;
    }

    return (
        <div className="h-[calc(100vh-4rem-4rem)] md:h-[calc(100vh-4rem-4rem)] bg-gray-200 flex flex-col p-0 sm:p-4 sm:md-2">
            <Board />
        </div>
    );
};

export default Dashboard;