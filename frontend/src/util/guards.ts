/**
 * A generic type guard to check if a key exists in an object.
 */
export const isKeyOf = <T extends object>(key: any, obj: T): key is keyof T => {
  return key != null && typeof obj === "object" && key in obj;
};

/**
 * Creates a reusable type guard for a specific object's keys.
 */
export const createKeyGuard =
  <T extends object>(obj: T) =>
  (key: any): key is keyof T =>
    isKeyOf(key, obj);
