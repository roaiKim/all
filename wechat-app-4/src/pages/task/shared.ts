import dayjs from "dayjs";

export const formatDateTime = (value: string | null | undefined) => {
    if (!value) {
        return "-";
    }
    const date = dayjs(value);
    if (!date.isValid()) {
        return "-";
    }
    return date.format("YYYY-MM-DD HH:mm");
};
