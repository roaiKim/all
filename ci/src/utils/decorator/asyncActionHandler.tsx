type CreatePromisedConfirmationPromise = "ok" | "cancel";

export function createPromisedConfirmation(text: string): Promise<CreatePromisedConfirmationPromise> {
    return new Promise((resolve) => {
        resolve("ok");
        // Dialog.confirm({
        //     content: text,
        //     onConfirm: () => {
        //         resolve("ok");
        //     },
        //     onCancel: () => {
        //         resolve("cancel");
        //     },
        // });
    });
}
