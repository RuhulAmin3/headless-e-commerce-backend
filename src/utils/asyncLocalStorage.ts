import { AsyncLocalStorage } from "node:async_hooks";

import { GlobalRequestData } from "../interfaces/globalRequestData";

export const asyncLocalStorage = new AsyncLocalStorage<GlobalRequestData>();

export const getGlobalData = () => {
  return asyncLocalStorage.getStore();
};

export function updateGlobalData(update: Partial<GlobalRequestData>) {
  const globalRequestInfo = getGlobalData() ?? {};
  const updatedRequestInfo = {
    ...globalRequestInfo,
    ...update,
  } as GlobalRequestData;
  asyncLocalStorage.enterWith(updatedRequestInfo);
}
