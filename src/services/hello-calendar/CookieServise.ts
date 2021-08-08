import Cookie from "universal-cookie";

const cookie = new Cookie();

export const get = (key: string) => cookie.get(key) as string;

export const set = (
  key: string,
  value: string,
  options: { path: string; expires: Date }
) => cookie.set(key, value, options);

export const remove = (key: string) => cookie.remove(key);
