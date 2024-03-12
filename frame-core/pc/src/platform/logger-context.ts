function generateUniqueId() {
    return new Date().getTime().toString(16) + "-" + Math.floor(Math.random() * 9999900 + 1000).toString(16);
}

function getSessionId() {
    try {
        const token = "@@framework-session-id";
        const previousId = sessionStorage.getItem(token);
        if (previousId) {
            return previousId;
        } else {
            const newId = generateUniqueId();
            sessionStorage.setItem(token, newId);
            return newId;
        }
    } catch (e) {
        return generateUniqueId();
    }
}

export const loggerContext = {
    request_url: () => location.href,
    session_id: getSessionId(),
};
