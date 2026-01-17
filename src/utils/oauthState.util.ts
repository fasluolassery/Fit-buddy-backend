export const encodeState = (data: object) => JSON.stringify(data);
export const decodeState = <T>(state: string): T => JSON.parse(state);
