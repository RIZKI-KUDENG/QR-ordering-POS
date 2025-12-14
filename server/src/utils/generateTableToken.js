import crypto from "crypto";

export const generateTableToken = () => {
    return "TBL-" +crypto.randomBytes(4).toString("hex").toUpperCase();
};