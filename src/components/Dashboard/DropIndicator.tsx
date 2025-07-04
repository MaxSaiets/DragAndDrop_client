interface DropIndicatorProps {
    beforeId: string;
    column: string;
}

export const DropIndicator = ({ beforeId, column }: DropIndicatorProps) => {
    return (
        <div
            data-before={beforeId || "-1"}
            data-column={column}
            className="my-0.5 h-0.5 w-full bg-green-200 opacity-0"
        />
    );
}; 