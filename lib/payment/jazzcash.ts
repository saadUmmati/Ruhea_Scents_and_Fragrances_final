// JazzCash Payment Utilities
import crypto from "crypto";

export interface JazzCashConfig {
    merchantId: string;
    password: string;
    integritySalt: string;
    returnUrl: string;
}

export interface JazzCashPaymentData {
    amount: number;
    billReference: string;
    description: string;
    customerEmail?: string;
    customerMobile?: string;
}

export function generateJazzCashHash(
    data: Record<string, string>,
    integritySalt: string
): string {
    // Sort keys alphabetically
    const sortedKeys = Object.keys(data).sort();

    // Create string with sorted values
    const sortedString = sortedKeys
        .map((key) => data[key])
        .join("&");

    // Append integrity salt
    const stringToHash = sortedString + "&" + integritySalt;

    // Generate HMAC SHA256 hash
    const hash = crypto
        .createHmac("sha256", integritySalt)
        .update(stringToHash)
        .digest("hex");

    return hash.toUpperCase();
}

export function createJazzCashPaymentForm(
    config: JazzCashConfig,
    paymentData: JazzCashPaymentData,
    orderId: string
): Record<string, string> {
    const txnDateTime = new Date().toISOString().replace(/[-:]/g, "").split(".")[0];
    const txnExpiryDateTime = new Date(Date.now() + 24 * 60 * 60 * 1000)
        .toISOString()
        .replace(/[-:]/g, "")
        .split(".")[0];

    const txnRefNo = `T${Date.now()}${Math.floor(Math.random() * 1000)}`;

    // Amount in paisa (multiply by 100)
    const amountInPaisa = Math.round(paymentData.amount * 100);

    const formData: Record<string, string> = {
        pp_Version: "1.1",
        pp_TxnType: "MWALLET",
        pp_Language: "EN",
        pp_MerchantID: config.merchantId,
        pp_SubMerchantID: "",
        pp_Password: config.password,
        pp_BankID: "TBANK",
        pp_ProductID: "RETL",
        pp_TxnRefNo: txnRefNo,
        pp_Amount: amountInPaisa.toString(),
        pp_TxnCurrency: "PKR",
        pp_TxnDateTime: txnDateTime,
        pp_BillReference: paymentData.billReference,
        pp_Description: paymentData.description,
        pp_TxnExpiryDateTime: txnExpiryDateTime,
        pp_ReturnURL: config.returnUrl,
        pp_SecureHash: "", // Will be calculated
    };

    // Add optional fields
    if (paymentData.customerEmail) {
        formData.ppmpf_1 = paymentData.customerEmail;
    }
    if (paymentData.customerMobile) {
        formData.ppmpf_2 = paymentData.customerMobile;
    }

    // Store order ID for callback
    formData.ppmpf_3 = orderId;

    // Generate secure hash (excluding pp_SecureHash itself)
    const hashData = { ...formData };
    delete hashData.pp_SecureHash;

    const secureHash = generateJazzCashHash(hashData, config.integritySalt);
    formData.pp_SecureHash = secureHash;

    return formData;
}

export function verifyJazzCashResponse(
    responseData: Record<string, string>,
    integritySalt: string
): boolean {
    const receivedHash = responseData.pp_SecureHash;

    // Remove hash from data
    const dataToVerify = { ...responseData };
    delete dataToVerify.pp_SecureHash;

    // Calculate expected hash
    const expectedHash = generateJazzCashHash(dataToVerify, integritySalt);

    return receivedHash === expectedHash;
}

export function isJazzCashPaymentSuccessful(responseCode: string): boolean {
    return responseCode === "000"; // 000 = Success
}

export function getJazzCashResponseMessage(responseCode: string): string {
    const messages: Record<string, string> = {
        "000": "Transaction Successful",
        "001": "Transaction Declined",
        "002": "Transaction Declined - Insufficient Funds",
        "003": "Transaction Declined - Invalid Card",
        "004": "Transaction Declined - Expired Card",
        "124": "Transaction Pending",
        "200": "Transaction Failed",
    };

    return messages[responseCode] || "Unknown Response";
}
