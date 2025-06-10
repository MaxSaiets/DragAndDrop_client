import { useState } from "react";
import type { ITask } from "../../types";
import { Card } from "./Card";
import { DropIndicator } from "./DropIndicator";
import { AddCard } from "./AddCard";

interface ColumnProps {
    title: string;
    column: "todo" | "in_progress" | "done";
    cards: ITask[];
    setCards: React.Dispatch<React.SetStateAction<ITask[]>>;
    onUpdateTask: (taskId: string, updates: Partial<ITask>) => Promise<void>;
}

export const Column = ({ title, column, cards, setCards, onUpdateTask }: ColumnProps) => {
    const [active, setActive] = useState(false);
    const filteredCards = cards.filter((card) => card.status === column);

    const handleDragStart = (e: React.DragEvent, card: ITask) => {
        e.dataTransfer.setData("cardId", card.id);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        highlightIndicator(e);
        setActive(true);
    };

    const highlightIndicator = (e: React.DragEvent) => {
        const indicators = getIndicators();
        clearHighlights(indicators);
        const el = getNearestIndicator(e, indicators);
        (el.element as HTMLElement).style.opacity = "1";
    };

    const clearHighlights = (els?: Element[]) => {
        const indicators = els || getIndicators();
        indicators.forEach((i) => {
            (i as HTMLElement).style.opacity = "0";
        });
    };

    const getNearestIndicator = (e: React.DragEvent, indicators: Element[]) => {
        const DISTANCE_OFFSET = 50;
        
        return indicators.reduce(
            (closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = e.clientY - (box.top + DISTANCE_OFFSET);

                if (offset < 0 && offset > closest.offset) {
                    return { offset: offset, element: child };
                } else {
                    return closest;
                }
            },
            {
                offset: Number.NEGATIVE_INFINITY,
                element: indicators[indicators.length - 1],
            }
        );
    };

    const getIndicators = () => {
        return Array.from(document.querySelectorAll(`[data-column="${column}"]`));
    };

    const handleDragLeave = () => {
        setActive(false);
        clearHighlights();
    };

    const handleDragEnd = async (e: React.DragEvent) => {
        setActive(false);
        clearHighlights();

        const cardId = e.dataTransfer.getData("cardId");
        const indicators = getIndicators();
        const { element } = getNearestIndicator(e, indicators);
        const before = (element as HTMLElement).dataset.before || "-1";

        if (before !== cardId) {
            let copy = [...cards];
            let cardToTransfer = copy.find((c) => c.id === cardId);
            
            if (!cardToTransfer) return;
            
            cardToTransfer = { ...cardToTransfer, status: column };
            copy = copy.filter((c) => c.id !== cardId);

            const moveToBack = before === "-1";

            if (moveToBack) {
                copy.push(cardToTransfer);
            } else {
                const insertAtIndex = copy.findIndex((el) => el.id === before);
                if (insertAtIndex === undefined) return;
                copy.splice(insertAtIndex, 0, cardToTransfer);
            }

            setCards(copy);
            await onUpdateTask(cardId, { status: column });
        }
    };

    return (
        <div className="flex-1 bg-gray-300 p-3 rounded-lg overflow-hidden flex flex-col">
            <div className="mb-3 flex items-center justify-between">
                <h3 className="font-bold text-xl text-neutral-600">{title}</h3>
                <span className="rounded text-sm text-neutral-400">{filteredCards.length}</span>
            </div>

            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDragEnd}
                className={`flex-1 w-full transition-colors overflow-y-auto md:pb-0 pb-16 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${
                    active ? "bg-neutral-800/50" : "bg-neutral-800/0"
                }`}
            >
                {filteredCards.map((card) => (
                    <Card key={card.id} {...card} handleDragStart={handleDragStart} />
                ))}
                <DropIndicator beforeId="-1" column={column} />
                <AddCard column={column} setCards={setCards} />
            </div>
        </div>
    );
}; 