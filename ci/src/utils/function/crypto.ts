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
export const decrypted = (s) => {
    try {
        const key = CryptoJS.enc.Utf8.parse("3ucrdlc6twh84o7h");
        const decrypt = CryptoJS.AES.decrypt(s, key, {
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.ZeroPadding,
            iv: key,
        });
        return CryptoJS.enc.Utf8.stringify(decrypt).toString();
    } catch (e) {
        console.error("error", e);
    }
};
