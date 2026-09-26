const allowedMimeTypes = new Set(["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]);

function startsWith(bytes: Uint8Array, signature: number[]): boolean {
  return signature.every((byte, index) => bytes[index] === byte);
}

export function detectSafeImageMime(bytes: Uint8Array, declaredMime: string): string | null {
  let detected: string | null = null;

  if (startsWith(bytes, [0xff, 0xd8, 0xff])) detected = "image/jpeg";
  else if (startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) detected = "image/png";
  else if (startsWith(bytes, [0x47, 0x49, 0x46, 0x38, 0x37, 0x61]) || startsWith(bytes, [0x47, 0x49, 0x46, 0x38, 0x39, 0x61])) detected = "image/gif";
  else if (
    bytes.length >= 12 &&
    startsWith(bytes, [0x52, 0x49, 0x46, 0x46]) &&
    bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
  ) detected = "image/webp";

  if (!detected) return null;
  if (declaredMime && (!allowedMimeTypes.has(declaredMime.toLowerCase()) || (declaredMime.toLowerCase() === "image/jpg" ? "image/jpeg" : declaredMime.toLowerCase()) !== detected)) {
    return null;
  }
  return detected;
}
