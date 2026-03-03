export const decodeJwt = (token: string) => {
    try {
        const payload = token.split(".")[1];
        const decodedPayload = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
        return decodedPayload;
    } catch {
        return null;
    }
}