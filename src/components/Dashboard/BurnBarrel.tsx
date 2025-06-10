import { useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store/store";
import type { ITask } from "../../types";
import { deleteTask } from "../../store/task/taskSlice";

interface BurnBarrelProps {
    setCards: React.Dispatch<React.SetStateAction<ITask[]>>;
}

export const BurnBarrel = ({ setCards }: BurnBarrelProps) => {
    const [active, setActive] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const dispatch = useDispatch<AppDispatch>();

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setActive(true);
    };

    const handleDragLeave = () => {
        setActive(false);
    };

    const handleDragEnd = async (e: React.DragEvent) => {
        const cardId = e.dataTransfer.getData("cardId");
        
        try {
            await dispatch(deleteTask(cardId)).unwrap();
            setCards((prev: ITask[]) => prev.filter((card: ITask) => card.id !== cardId));
        } catch (error) {
            console.error("Failed to delete task:", error);
        }
        
        setActive(false);
        setIsDragging(false);
    };

    if (typeof window !== 'undefined') {
        window.addEventListener('dragstart', () => setIsDragging(true));
        window.addEventListener('dragend', () => {
            setIsDragging(false);
            setActive(false);
        });
    }

    if (!isDragging) return null;

    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDragEnd}
            className={`fixed right-3 bottom-20 flex h-20 w-20 shrink-0 justify-center items-center rounded border text-3xl z-1000 transition-all duration-300 ${
                active
                    ? "border-red-800 bg-red-800/20 text-red-500 scale-110"
                    : "border-neutral-500 bg-gray-700/70 text-neutral-700"
            }`}
        >
            🗑️
        </div>
    );
}; 