export function pipe(value, ...functions) {
  const context = this === globalThis ? null : this;
  const detail = { context, data: {}, pipe: functions, size: functions.length };
  for (const [index, self] of functions.entries()) {
    detail.index = index;
    detail.self = self;
    value = self.call(context, value, detail);
  }
  return value;
}

export async function pipe_async(value, ...functions) {
  const context = this === globalThis ? null : this;
  const detail = { context, data: {}, pipe: functions, size: functions.length };
  for (const [index, self] of functions.entries()) {
    detail.index = index;
    detail.self = self;
    value = await self.call(context, value, detail);
  }
  return value;
}
