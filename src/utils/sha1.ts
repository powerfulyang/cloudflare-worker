export async function sha1(file: File) {
  const fileData = await file.arrayBuffer();
  const digest = await crypto.subtle.digest('SHA-1', fileData);
  const array = Array.from(new Uint8Array(digest));
  return array.map(b => b.toString(16).padStart(2, '0')).join('');
}
