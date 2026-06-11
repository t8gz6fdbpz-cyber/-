export function repeatItems<T>(items: T[], times: number) {
  return Array.from({ length: times }, () => items).flat();
}
