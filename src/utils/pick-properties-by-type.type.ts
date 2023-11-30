export type PickPropertiesByType<T, Type> = {
  [P in keyof T as T[P] extends Type ? P : never]: P;
};
