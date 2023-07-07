import { ValueObject } from './value-object';

export class Name extends ValueObject<string> {
  constructor(name: string) {
    super(name);
    this.isValid();
  }

  isValid() {
    return this.value.length >= 3;
  }
}
