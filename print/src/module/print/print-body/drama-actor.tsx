import { Director } from "../controller";
import type { DramaActor } from "../main";
import type { WebPrint } from "../main/print";
import { Agent } from "../shapes/text";

interface StageManagerProps {
    dramaActor: DramaActor;
    stagePlay: WebPrint;
    spotlighting: boolean;
    movingState: any;
}

export default function StageManager(props: StageManagerProps) {
    const { dramaActor, stagePlay, spotlighting, movingState } = props;

    return (
        <Director element={dramaActor} movingState={movingState} printModule={stagePlay} spotlighting={spotlighting}>
            <Agent printElement={dramaActor} printModule={stagePlay} />
        </Director>
    );
}
