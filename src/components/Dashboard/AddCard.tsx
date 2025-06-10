import { useState } from "react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store/store";
import type { ITask } from "../../types";
import { createTask } from "../../store/task/taskSlice";
import type { Dispatch, SetStateAction } from "react";

interface AddCardProps {
    column: string;
    setCards: Dispatch<SetStateAction<ITask[]>>;
}

export const AddCard = ({ column, setCards }: AddCardProps) => {
    const [text, setText] = useState("");
    const [adding, setAdding] = useState(false);
    const dispatch = useDispatch<AppDispatch>();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!text.trim().length) return;

        try {
            const newTask = await dispatch(createTask({
                title: text,
                status: column as ITask["status"],
                priority: "medium",
                description: "",
            })).unwrap();

            setCards((prev) => [...prev, newTask]);
            setText("");
            setAdding(false);
        } catch (error) {
            console.error("Failed to create task:", error);
        }
    };

    return (
        <>
            {adding ? (
                <motion.form layout onSubmit={handleSubmit}>
                    <textarea
                        onChange={(e) => setText(e.target.value)}
                        autoFocus
                        placeholder="Add new task..."
                        className="w-full rounded border border-green-200 bg-green-100/40 p-3 text-sm text-neutral-800 placeholder-black focus:outline-0"
                    />
                    <div className="mt-1.5 flex items-center justify-end gap-1.5">
                        <button
                            onClick={() => setAdding(false)}
                            className="px-3 py-1.5 text-xs text-neutral-600 transition-colors hover:text-neutral-50"
                        >
                            Close
                        </button>
                        <button
                            type="submit"
                            className="flex items-center gap-1.5 rounded bg-gray-400 px-3 py-1.5 text-xs text-neutral-950 transition-colors hover:bg-neutral-300"
                        >
                            Add
                        </button>
                    </div>
                </motion.form>
            ) : (
                <motion.button
                    layout
                    onClick={() => setAdding(true)}
                    className="flex w-full justify-end items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50"
                >
                    <span>Add card</span>
                </motion.button>
            )}
        </>
    );
}; 