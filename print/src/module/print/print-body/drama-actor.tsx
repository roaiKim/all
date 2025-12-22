import { Director } from "../controller";
import type { PrintElement } from "../main";
import type { WebPrint } from "../main/print";
import { DramaActor } from "../shapes/text";

interface StageManagerProps {
    dramaActor: PrintElement;
    stagePlay: WebPrint;
    spotlighting: boolean;
    movingState: any;
}

export default function StageManager(props: StageManagerProps) {
    const { dramaActor, stagePlay, spotlighting, movingState } = props;

    return (
        <Director element={dramaActor} movingState={movingState} printModule={stagePlay} spotlighting={spotlighting}>
            <DramaActor printElement={dramaActor} printModule={stagePlay} />
        </Director>
    );
}
