type Loader<T> = () => Promise<T>;

interface Resource<T> {
  get: () => T | null;
  load: () => Promise<T>;
  read: () => T;
}

export type { Loader, Resource };
