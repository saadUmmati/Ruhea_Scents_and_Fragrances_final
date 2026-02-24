// EasyPaisa Payment Utilities
import crypto from "crypto";

export interface EasyPaisaConfig {
    storeId: string;
    apiKey: string;
    returnUrl: string;
    apiUrl: string;
}

export interface EasyPaisaPaymentData {
    amount: number;
    orderId: string;
    description: string;
    customerEmail?: string;
    customerMobile?: string;
}

export function generateEasyPaisaHash(
    data: string,
    apiKey: string
): string {
    const hash = crypto
        .createHmac("sha256", apiKey)
        .update(data)
        .digest("hex");

    return hash.toUpperCase();
}

export function createEasyPaisaPaymentRequest(
    config: EasyPaisaConfig,
    paymentData: EasyPaisaPaymentData
): any {
    const timestamp = new Date().toISOString();
    const transactionId = `EP${Date.now()}${Math.floor(Math.random() * 1000)}`;

    // Amount in paisa (multiply by 100)
    const amountInPaisa = Math.round(paymentData.amount * 100);

    const requestData = {
        storeId: config.storeId,
        orderId: paymentData.orderId,
        transactionAmount: amountInPaisa.toString(),
        transactionType: "MA", // Mobile Account
        mobileAccountNo: paymentData.customerMobile || "",
        emailAddress: paymentData.customerEmail || "",
        tokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        bankIdentificationNumber: "",
        encryptedHashRequest: "", // Will be calculated
        merchantPaymentMethod: "",
        postBackURL: config.returnUrl,
        signature: "", // Will be calculated
    };

    // Generate hash for request
    const hashString = `${config.storeId}${amountInPaisa}${paymentData.orderId}`;
    const hash = generateEasyPaisaHash(hashString, config.apiKey);

    requestData.encryptedHashRequest = hash;
    requestData.signature = hash;

    return requestData;
}

export function verifyEasyPaisaResponse(
    responseData: any,
    apiKey: string,
    storeId: string
): boolean {
    const receivedHash = responseData.encryptedHashResponse || responseData.signature;

    // Generate expected hash
    const hashString = `${storeId}${responseData.transactionAmount}${responseData.orderId}`;
    const expectedHash = generateEasyPaisaHash(hashString, apiKey);

    return receivedHash === expectedHash;
}

export function isEasyPaisaPaymentSuccessful(responseCode: string): boolean {
    return responseCode === "0000" || responseCode === "00"; // Success codes
}

export function getEasyPaisaResponseMessage(responseCode: string): string {
    const messages: Record<string, string> = {
        "0000": "Transaction Successful",
        "00": "Transaction Successful",
        "0001": "Transaction Declined",
        "0002": "Insufficient Funds",
        "0003": "Invalid Account",
        "0004": "Transaction Timeout",
        "9999": "Transaction Failed",
    };

    return messages[responseCode] || "Unknown Response";
}
