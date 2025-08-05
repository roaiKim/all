import React from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const ItemTypes = {
    CARD: "card",
};

const Card = ({ id, text, index, moveCard }) => {
    const ref = React.useRef(null);

    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.CARD,
        item: { id, index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [, drop] = useDrop({
        accept: ItemTypes.CARD,
        hover(item: any, monitor) {
            if (!ref.current) return;
            const dragIndex = item.index;
            const hoverIndex = index;

            if (dragIndex === hoverIndex) return;

            const hoverBoundingRect = ref.current?.getBoundingClientRect();
            const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
            const clientOffset = monitor.getClientOffset();
            const hoverClientX = clientOffset.x - hoverBoundingRect.left;

            if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) return;
            if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) return;

            moveCard(dragIndex, hoverIndex);
            item.index = hoverIndex;
        },
    });

    drag(drop(ref));

    return (
        <div
            ref={ref}
            style={{
                opacity: isDragging ? 0.5 : 1,
                padding: "16px",
                margin: "0 8px",
                backgroundColor: "#f0f0f0",
                cursor: "move",
                display: "inline-block",
                border: "1px solid #ddd",
                borderRadius: "4px",
            }}
        >
            {text}
        </div>
    );
};

const HorizontalSortableList = () => {
    const [cards, setCards] = React.useState([
        { id: 1, text: "Item 1" },
        { id: 2, text: "Item 2" },
        { id: 3, text: "Item 3" },
        { id: 4, text: "Item 4" },
    ]);

    const moveCard = (dragIndex, hoverIndex) => {
        const dragCard = cards[dragIndex];
        const newCards = [...cards];
        newCards.splice(dragIndex, 1);
        newCards.splice(hoverIndex, 0, dragCard);
        setCards(newCards);
    };

    return (
        <div style={{ whiteSpace: "nowrap", padding: "16px" }}>
            {cards.map((card, index) => (
                <Card key={card.id} id={card.id} index={index} text={card.text} moveCard={moveCard} />
            ))}
        </div>
    );
};

export default function App() {
    return (
        <DndProvider backend={HTML5Backend}>
            <HorizontalSortableList />
        </DndProvider>
    );
}
