import { Director } from "../controller";
import type { WebPrint } from "../main/print";
import { Agent } from "../shapes/text";
import type { DramaActor } from "../type";

interface StageManagerProps {
    dramaActor: DramaActor;
    stagePlay: WebPrint;
    spotlighting: boolean;
    protagonist: any;
}

export default function StageManager(props: StageManagerProps) {
    const { dramaActor, stagePlay, spotlighting, protagonist } = props;

    return (
        <Director element={dramaActor} protagonist={protagonist} printModule={stagePlay} spotlighting={spotlighting}>
            <Agent printElement={dramaActor} printModule={stagePlay} />
        </Director>
    );
}
