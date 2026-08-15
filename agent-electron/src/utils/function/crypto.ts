import JSEncrypt from "jsencrypt";
import CryptoJS from "crypto-js";

// 加密
export const encrypted = (password: string) => {
    try {
        const key = CryptoJS.enc.Utf8.parse("3ucrdlc6twh84o7h");
        const aes = CryptoJS.AES.encrypt(password, key, {
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.ZeroPadding,
            iv: key,
        });
        const ct = aes.ciphertext;
        return ct.toString(CryptoJS.enc.Base64);
    } catch (error) {
        console.error("加密错误: error", error);
    }
};

// 解密
export const decrypted = (sign: string) => {
    try {
        const key = CryptoJS.enc.Utf8.parse("3ucrdlc6twh84o7h");
        const decrypt = CryptoJS.AES.decrypt(sign, key, {
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.ZeroPadding,
            iv: key,
        });
        return CryptoJS.enc.Utf8.stringify(decrypt).toString();
    } catch (e) {
        console.error("解密错误: error", e);
    }
};

// 密码加密
export const passwordEncrypted = (value: string) => {
    try {
        const encrypt = new JSEncrypt();
        encrypt.setPublicKey(
            `MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAoGIWI6/jHroQH4lMmXla1SnVelzipKeNg6Yf4cf4Y7aNgMUzhpfnfvIYZO3ydFSWaPnsYv4WOcdrBC9AawvFCgort5Qz13c01MMvdM6IGjZmAzpvZIndGDI9WxXldMFFHYngd2uXqdQQVwACMiOnQS+vjlgCsh5HVH3aJ993w8CD4y/7Xy3l3yAjr/Q3PZcvvEwKZKoi1AqWMhxBcoigudWhSlna/H10gUUAmsbNACfPgEo6f9enCTNFtLf5xl/4APkF0Rxn7ZsaajN/am3ZBmxivEN+uo6dxcjMLS0WdjOd/DHrvu9IaxOgY9Sw5IFKs1bi31D6sHyMcr2aHa3l+wIDAQAB`
        );
        return encrypt.encrypt(value) as string;
    } catch (e) {
        console.error("error", e);
        return "";
    }
};
