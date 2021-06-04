import React from "react";
import { Checkbox } from "antd";
import { SortableContainer, SortableElement } from "react-sortable-hoc";

const SortableItem = SortableElement(({ column, onChange }) => (
    <li className="ro-table-sort-columns-container-li">
        <Checkbox checked={!column.hide} onChange={(event) => onChange(event, column)} />
        {column.title}
    </li>
));

const SortableList = SortableContainer(({ items, onChange }) => (
    <ul className="ro-table-sort-columns-container">
        {items.map((column, index) => (
            <SortableItem key={`item-${column.key}`} column={column} index={index} onChange={onChange} />
        ))}
    </ul>
));

export default function SortableComponent(props) {
    const { columns, onSortColumns, onChange } = props;
    return <SortableList items={columns} onSortEnd={onSortColumns} onChange={onChange} />;
}
