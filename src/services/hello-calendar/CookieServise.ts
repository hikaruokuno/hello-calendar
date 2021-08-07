import Cookie from "universal-cookie";

const cookie = new Cookie();

export const get = (key: string) => cookie.get(key) as string;

export const set = (key: string, value: string) => cookie.set(key, value);

export const remove = (key: string) => cookie.remove(key);
