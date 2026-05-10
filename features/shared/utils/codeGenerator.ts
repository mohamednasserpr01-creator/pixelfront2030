import { customAlphabet } from "nanoid";

// 16 رقم فقط (بدون أي حروف)
const nano = customAlphabet('0123456789', 16);

export function generateCodesData(count: number, price: number | string, startSerial: number = 84027) {
    const codes = [];
    for (let i = 0; i < count; i++) {
        codes.push({
            serial: (startSerial + i).toString(),
            code: nano(),
            price: price.toString()
        });
    }
    return codes;
}