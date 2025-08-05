import React, { useState } from "react";
import { closestCenter, DndContext, DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, horizontalListSortingStrategy, SortableContext, sortableKeyboardCoordinates, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Item {
    id: string;
    content: string;
}

const SortableItem = ({ id, content }: Item) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        display: "inline-block",
        margin: "0 10px",
        padding: "20px",
        background: "#fff",
        border: "1px solid #ddd",
        borderRadius: "4px",
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {content}
        </div>
    );
};

export const HorizontalSortableList = () => {
    const [items, setItems] = useState<Item[]>([
        { id: "1", content: "Item 1" },
        { id: "2", content: "Item 2" },
        { id: "3", content: "Item 3" },
        { id: "4", content: "Item 4" },
    ]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setItems((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={items} strategy={horizontalListSortingStrategy}>
                <div style={{ display: "flex", padding: "20px" }}>
                    {items.map((item) => (
                        <SortableItem key={item.id} id={item.id} content={item.content} />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
};
