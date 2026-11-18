import JSEncrypt from "jsencrypt";

const encryptKey =
    "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAoGIWI6/jHroQH4lMmXla1SnVelzipKeNg6Yf4cf4Y7aNgMUzhpfnfvIYZO3ydFSWaPnsYv4WOcdrBC9AawvFCgort5Qz13c01MMvdM6IGjZmAzpvZIndGDI9WxXldMFFHYngd2uXqdQQVwACMiOnQS+vjlgCsh5HVH3aJ993w8CD4y/7Xy3l3yAjr/Q3PZcvvEwKZKoi1AqWMhxBcoigudWhSlna/H10gUUAmsbNACfPgEo6f9enCTNFtLf5xl/4APkF0Rxn7ZsaajN/am3ZBmxivEN+uo6dxcjMLS0WdjOd/DHrvu9IaxOgY9Sw5IFKs1bi31D6sHyMcr2aHa3l+wIDAQAB";

export const encrypted = (s: string): string => {
    try {
        const encrypt = new JSEncrypt();
        encrypt.setPublicKey(encryptKey);
        return encrypt.encrypt(s) || "";
    } catch (e) {
        console.error("error", e);
        return "";
    }
};
