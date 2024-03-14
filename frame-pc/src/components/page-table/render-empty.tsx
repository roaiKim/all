import { usePageError } from "utils/hooks/useLoading";
import { pageEmpty } from "./empty";

const PageEmpty = pageEmpty;

interface RenderEmptyProps {
    handler?: (...args: any[]) => void;
}

export function RenderEmpty(props: RenderEmptyProps) {
    const { handler } = props;
    const sourceLoadError = usePageError();

    return <PageEmpty error={sourceLoadError} handler={() => {}} />;
}
