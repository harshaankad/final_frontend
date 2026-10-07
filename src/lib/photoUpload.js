// Rules for the patient photo pickers on step 2. The server re-checks the
// real file content; these only give a quick, friendly message for obvious
// mismatches.

// HEIC is deliberately NOT listed. When a page's file picker doesn't accept
// HEIC, iPhone Safari converts photos to JPEG before uploading. Listing it
// made iPhones send raw HEIC, which the server cannot decode.
export const ACCEPTED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const PHOTO_ACCEPT = ACCEPTED_PHOTO_TYPES.join(",");
export const MAX_PHOTO_SIZE_MB = 10;

const HEIC_TYPES = ["image/heic", "image/heif", "image/heic-sequence", "image/heif-sequence"];

// Returns a message for a file we can't take, or null if it looks fine.
// Judged by the browser-reported type only (never the file name): some
// browsers report no type at all, and the server has the final say.
export function photoError(file) {
  if (file.size > MAX_PHOTO_SIZE_MB * 1024 * 1024) {
    return `"${file.name}" exceeds ${MAX_PHOTO_SIZE_MB}MB limit.`;
  }
  if (HEIC_TYPES.includes(file.type)) {
    return `"${file.name}" is a HEIC photo (the iPhone camera format), which can't be processed. Please upload it as JPEG or PNG.`;
  }
  if (file.type && !ACCEPTED_PHOTO_TYPES.includes(file.type)) {
    return `"${file.name}" is not a supported image. Please use a JPEG, PNG or WebP photo.`;
  }
  return null;
}
