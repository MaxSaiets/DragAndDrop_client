import { motion } from "framer-motion";
import type { ITask } from "../../types";
import { format } from "date-fns";

interface CardProps extends ITask {
    handleDragStart: (e: React.DragEvent, card: ITask) => void;
}

const priorityColors = {
    low: "bg-green-500",
    medium: "bg-yellow-500",
    high: "bg-red-500"
};

export const Card = ({ id, title, handleDragStart, priority, progress, dueDate, ...rest }: CardProps) => {
    return (
        <motion.div
            layout="position"
            layoutId={`card-${id}`}
            draggable="true"
            onDragStart={(e) => handleDragStart(e as unknown as React.DragEvent<HTMLDivElement>, { id, title, priority, progress, dueDate, ...rest })}
            className="cursor-grab rounded border border-neutral-700 bg-neutral-800 p-3 active:cursor-grabbing relative z-10"
        >
            <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-neutral-100">{title}</p>
                
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${priorityColors[priority]}`} />
                        <span className="text-xs text-neutral-400">{priority}</span>
                    </div>
                    {dueDate && (
                        <span className="text-xs text-neutral-400">
                            {format(new Date(dueDate), 'MMM d')}
                        </span>
                    )}
                </div>

                <div className="w-full bg-neutral-700 rounded-full h-1.5">
                    <div 
                        className="bg-green-500 h-1.5 rounded-full" 
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        </motion.div>
    );
}; 