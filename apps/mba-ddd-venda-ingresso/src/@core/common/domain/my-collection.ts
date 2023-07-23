import { Collection } from '@mikro-orm/core';

export interface ICollection<T extends object> {
  getItems(): Iterable<T>;
  add(item: T, ...items: T[]): void;
  remove(item: T, ...items: T[]): void;
  find(predicate: (item: T) => boolean): T | undefined;
  forEach(callbackfn: (value: T, index: number) => void): void;
  map<U>(callbackfn: (value: T, index: number) => U): U[];
  removeAll(): void;
  count(): number;
  [Symbol.iterator](): IterableIterator<T>;
}
//Design Pattern - Proxy

export type AnyCollection<T extends object> = Collection<T>;

export class MyCollectionFactory {
  static create<T extends object>(ref): ICollection<T> {
    const collection = new Collection<T>(ref);
    collection['initialized'] = false;
    return MyCollectionFactory.createProxy(collection);
  }

  static createFrom<T extends object>(target: Collection<any>): ICollection<T> {
    return MyCollectionFactory.createProxy(target);
  }

  private static createProxy<T extends object>(
    target: Collection<T>,
  ): ICollection<T> {
    //@ts-expect-error - Proxy
    return new Proxy(target, {
      get(target, prop, receiver) {
        if (prop === 'find') {
          return (predicate: (item: T) => boolean): T | undefined => {
            return target.getItems(false).find(predicate);
          };
        }

        if (prop === 'forEach') {
          return (callbackfn: (value: T, index: number) => void): void => {
            return target.getItems(false).forEach(callbackfn);
          };
        }

        if (prop === 'count') {
          return () => {
            return target.isInitialized() ? target.getItems().length : 0;
          };
        }

        if (prop === 'map') {
          return (callbackfn: (value: T, index: number) => any): any[] => {
            return target.getItems(false).map(callbackfn);
          };
        }

        return Reflect.get(target, prop, receiver);
      },
    });
  }
}
