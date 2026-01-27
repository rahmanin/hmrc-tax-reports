export const compose =
  <T>(...fns: Array<(arg: T) => T>) =>
  (input: T): T =>
    fns.reduceRight((acc, fn) => fn(acc), input);
