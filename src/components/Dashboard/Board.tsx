import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import type { ITask } from "../../types";
import { updateTask } from "../../store/task/taskSlice";
import { Column } from "./Column";
import { BurnBarrel } from "./BurnBarrel";

export const Board = () => {
    const dispatch = useDispatch<AppDispatch>();
    const tasks = useSelector((state: RootState) => state.task.tasks);
    const [cards, setCards] = useState<ITask[]>([]);

    useEffect(() => {
        setCards(tasks);
    }, [tasks]);

    const handleUpdateTask = async (taskId: string, updates: Partial<ITask>) => {
        try {
            await dispatch(updateTask({ id: taskId, updates })).unwrap();
        } catch (error) {
            console.error("Failed to update task:", error);
        }
    };

    return (
        <div className="relative h-[100%] flex flex-col md:flex-row justify-between gap-3 md:gap-6 p-3  md:p-1">
            <Column 
                title="TODO" 
                column="todo" 
                cards={cards} 
                setCards={setCards}
                onUpdateTask={handleUpdateTask}
            />
            <Column 
                title="In Progress" 
                column="in_progress" 
                cards={cards} 
                setCards={setCards}
                onUpdateTask={handleUpdateTask}
            />
            <Column 
                title="Complete" 
                column="done" 
                cards={cards} 
                setCards={setCards}
                onUpdateTask={handleUpdateTask}
            />
            <BurnBarrel setCards={setCards} />
        </div>
    );
}; 