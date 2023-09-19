import mod from './mod_add.wasm';

const instance: any = await WebAssembly.instantiate(mod);

export const add = async () => {
  return instance.exports.add(2, 3);
};
