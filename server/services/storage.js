export async function uploadImage(file) {
  if (!file) {
    return null;
  }

  const base64 = file.buffer.toString('base64');
  return `data:${file.mimetype};base64,${base64}`;
}
