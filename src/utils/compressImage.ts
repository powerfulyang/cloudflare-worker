export const compressImage = async (file: File) => {
  if (!file.type.startsWith('image/')) {
    return '';
  }
  const fromData = new FormData();
  fromData.append('images', file);
  const res = await fetch('https://api.powerfulyang.com/api/tools/compress', {
    method: 'POST',
    body: fromData,
  });
  if (!res.ok) {
    throw new Error('compress fail');
  }
  return res.arrayBuffer();
};
