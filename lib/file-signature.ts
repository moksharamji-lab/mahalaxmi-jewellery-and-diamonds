import "server-only";

function startsWithBytes(
  bytes: Uint8Array,
  signature: number[]
): boolean {
  if (bytes.length < signature.length) {
    return false;
  }

  return signature.every(
    (value, index) => bytes[index] === value
  );
}

function asciiAt(
  bytes: Uint8Array,
  offset: number,
  value: string
): boolean {
  if (bytes.length < offset + value.length) {
    return false;
  }

  for (let i = 0; i < value.length; i++) {
    if (bytes[offset + i] !== value.charCodeAt(i)) {
      return false;
    }
  }

  return true;
}

export async function detectSupportedMimeType(
  file: File
): Promise<string | null> {
  const bytes = new Uint8Array(
    await file.slice(0, 16).arrayBuffer()
  );

  // JPEG
  if (
    startsWithBytes(bytes, [
      0xff,
      0xd8,
      0xff,
    ])
  ) {
    return "image/jpeg";
  }

  // PNG
  if (
    startsWithBytes(bytes, [
      0x89,
      0x50,
      0x4e,
      0x47,
      0x0d,
      0x0a,
      0x1a,
      0x0a,
    ])
  ) {
    return "image/png";
  }

  // WebP
  if (
    asciiAt(bytes, 0, "RIFF") &&
    asciiAt(bytes, 8, "WEBP")
  ) {
    return "image/webp";
  }

  // MP4 / ISO Base Media File Format
  if (asciiAt(bytes, 4, "ftyp")) {
    return "video/mp4";
  }

  // WebM / EBML
  if (
    startsWithBytes(bytes, [
      0x1a,
      0x45,
      0xdf,
      0xa3,
    ])
  ) {
    return "video/webm";
  }

  return null;
}