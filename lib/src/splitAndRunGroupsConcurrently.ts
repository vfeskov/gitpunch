export default function splitAndRunGroupsConcurrently<T>(
  params: Array<T>,
  concurrency: number,
  callback: (params: Array<T>) => Promise<any>
) {
  const groups = params.reduce(
    (res, item, index) => ({
      ...res,
      [index % concurrency]: [...(res[index % concurrency] || []), item],
    }),
    {} as { [i: number]: Array<T> }
  );
  return Promise.all(
    Array.from(Array(concurrency)).map((_, index) => callback(groups[index]))
  );
}
