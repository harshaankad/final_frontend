// Step 2 photo picker rules (src/lib/photoUpload.js).
//
//   npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { ACCEPTED_PHOTO_TYPES, PHOTO_ACCEPT, MAX_PHOTO_SIZE_MB, photoError } from "../src/lib/photoUpload.js";

const MB = 1024 * 1024;
// photoError only reads name, size and type, like a browser File.
const file = (name, type, size = 2 * MB) => ({ name, type, size });

test("the picker does not offer HEIC, so iPhones convert photos to JPEG", () => {
  assert.doesNotMatch(PHOTO_ACCEPT, /heic|heif/i);
  assert.equal(PHOTO_ACCEPT, "image/jpeg,image/png,image/webp");
  assert.deepEqual(ACCEPTED_PHOTO_TYPES, ["image/jpeg", "image/png", "image/webp"]);
});

test("JPEG, PNG and WebP photos are accepted", () => {
  assert.equal(photoError(file("a.jpg", "image/jpeg")), null);
  assert.equal(photoError(file("b.png", "image/png")), null);
  assert.equal(photoError(file("c.webp", "image/webp")), null);
});

test("a file with no browser-reported type is left for the server to judge", () => {
  assert.equal(photoError(file("IMG_0001", "")), null);
});

test("the type decides, not the name: a converted iPhone JPEG is never rejected", () => {
  assert.equal(photoError(file("IMG_0001.HEIC", "image/jpeg")), null);
});

test("HEIC and HEIF photos get a message that says what to do", () => {
  for (const type of ["image/heic", "image/heif", "image/heic-sequence", "image/heif-sequence"]) {
    const msg = photoError(file("IMG_0001.HEIC", type));
    assert.ok(msg, `${type} should be rejected`);
    assert.match(msg, /HEIC/);
    assert.match(msg, /JPEG or PNG/);
    assert.match(msg, /IMG_0001\.HEIC/);
  }
});

test("other image types are rejected with the generic message", () => {
  for (const type of ["image/gif", "image/bmp", "image/tiff", "image/svg+xml", "application/pdf"]) {
    assert.match(photoError(file("x", type)), /not a supported image/, type);
  }
});

test("size limit: exactly 10 MB is fine, one byte more is not", () => {
  assert.equal(MAX_PHOTO_SIZE_MB, 10);
  assert.equal(photoError(file("big.jpg", "image/jpeg", 10 * MB)), null);
  assert.match(photoError(file("big.jpg", "image/jpeg", 10 * MB + 1)), /exceeds 10MB limit/);
});

test("an oversized file reports the size problem first", () => {
  assert.match(photoError(file("big.heic", "image/heic", 11 * MB)), /exceeds 10MB limit/);
});

test("both step 2 pickers use the shared accept list, with no HEIC left in the page", () => {
  const page = readFileSync(new URL("../src/app/step2/page.js", import.meta.url), "utf8");
  assert.equal(page.match(/accept=\{PHOTO_ACCEPT\}/g)?.length, 2);
  assert.doesNotMatch(page, /image\/hei[cf]/);
  assert.match(page, /photoError\(file\)/);
});
