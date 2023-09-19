import encodeWebp, { init as initWebpWasm } from '@jsquash/webp/encode';
import * as photon from '@silvia-odwyer/photon';
import webpWasmModule from '../../node_modules/@jsquash/webp/codec/enc/webp_enc.wasm';
import photonWasmModule from '../../node_modules/@silvia-odwyer/photon/photon_rs_bg.wasm';

const imports: any = {
  './photon_rs_bg.js': photon,
};

const photonInstance = await WebAssembly.instantiate(photonWasmModule, imports);
photon.setWasm(photonInstance.exports);

await initWebpWasm(webpWasmModule);

export const compress = async (arg: File | Uint8Array) => {
  let vec: Uint8Array;
  if (arg instanceof File) {
    if (!arg.type.startsWith('image/')) {
      return '';
    }
    vec = new Uint8Array(await arg.arrayBuffer());
  } else {
    vec = arg;
  }
  let instance = photon.PhotonImage.new_from_byteslice(vec);
  const width = instance.get_width();
  const height = instance.get_height();
  const targetWidth = 300;
  const targetHeight = 300;

  // 计算裁剪的起始点和结束点
  let startX = 0;
  let startY = 0;
  let endX = width;
  let endY = height;

  if (width > height) {
    // 如果宽度大于高度，则水平居中裁剪
    startX = (width - height) / 2;
    endX = startX + height;
  } else if (height > width) {
    // 如果高度大于宽度，则垂直居中裁剪
    startY = (height - width) / 2;
    endY = startY + width;
  }
  // 裁剪图片为正方形
  instance = photon.crop(instance, startX, startY, endX, endY);

  // resize to 300x300
  // Lanczos滤波器是一种基于窗口化的 Sinc 重采样方法。
  // 它通常用于高质量的图像缩放，尤其适合于缩小图像。
  // Lanczos滤波器能够很好地保留细节，但在某些情况下也可能产生振铃效应。
  instance = photon.resize(instance, targetWidth, targetHeight, 5);
  return encodeWebp(instance.get_image_data());
};
