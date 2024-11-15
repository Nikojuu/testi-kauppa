import crypto from "crypto";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const calculateHmac = (secret: any, headers: any, body: any) => {
  const hmacPayload = Object.keys(headers)
    .sort()
    .map((key) => [key, headers[key]].join(":"))
    .concat(body ? JSON.stringify(body) : "")
    .join("\n");

  return crypto.createHmac("sha256", secret).update(hmacPayload).digest("hex");
};
