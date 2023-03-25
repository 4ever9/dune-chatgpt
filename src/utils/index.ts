import { v4 } from "uuid";

export function uuid() {
  return v4();
}

export function getVersion() {
  return chrome.runtime.getManifest().version;
}
