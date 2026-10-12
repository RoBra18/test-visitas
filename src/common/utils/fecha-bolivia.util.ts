export function fechaBoliviaInicioUtc(fechaStr: string): Date {
  return new Date(`${fechaStr}T00:00:00.000-04:00`);
}

export function fechaBoliviaFinUtc(fechaStr: string): Date {
  return new Date(`${fechaStr}T23:59:59.999-04:00`);
}
