import {
  ProxyFetchRequestMessage,
  ProxyFetchResponseBodyChunkMessage,
  ProxyFetchResponseMetadataMessage,
  RequestInitSubset,
} from "./types/messaging";
import { streamAsyncIterable } from "./utils/stream-async-iterable";
import { string2Uint8Array, uint8Array2String } from "./utils/encoding";
import { uuid } from "./utils";

export function setupProxyExecutor() {
  // one port for one fetch request
  chrome.runtime.onConnect.addListener((port) => {
    const abortController = new AbortController();
    port.onDisconnect.addListener(() => {
      abortController.abort();
    });
    port.onMessage.addListener(async (message: ProxyFetchRequestMessage) => {
      console.debug("proxy fetch", message.url, message.options);
      const resp = await fetch(message.url, {
        ...message.options,
        signal: abortController.signal,
      });
      port.postMessage({
        type: "PROXY_RESPONSE_METADATA",
        metadata: {
          status: resp.status,
          statusText: resp.statusText,
          headers: Object.fromEntries(resp.headers.entries()),
        },
      } as ProxyFetchResponseMetadataMessage);
      for await (const chunk of streamAsyncIterable(resp.body!)) {
        port.postMessage({
          type: "PROXY_RESPONSE_BODY_CHUNK",
          value: uint8Array2String(chunk),
          done: false,
        } as ProxyFetchResponseBodyChunkMessage);
      }
      port.postMessage({
        type: "PROXY_RESPONSE_BODY_CHUNK",
        done: true,
      } as ProxyFetchResponseBodyChunkMessage);
    });
  });
}

export async function proxyFetch(
  tabId: number,
  url: string,
  options?: RequestInitSubset
): Promise<Response> {
  console.debug("proxyFetch", tabId, url, options);
  return new Promise((resolve) => {
    const port = chrome.tabs.connect(tabId, { name: uuid() });
    port.onDisconnect.addListener(() => {
      throw new DOMException("proxy fetch aborted", "AbortError");
    });
    options?.signal?.addEventListener("abort", () => port.disconnect());
    const body = new ReadableStream({
      start(controller) {
        port.onMessage.addListener(function onMessage(
          message:
            | ProxyFetchResponseMetadataMessage
            | ProxyFetchResponseBodyChunkMessage
        ) {
          if (message.type === "PROXY_RESPONSE_METADATA") {
            const response = new Response(body, message.metadata);
            resolve(response);
          } else if (message.type === "PROXY_RESPONSE_BODY_CHUNK") {
            if (message.done) {
              controller.close();
              port.onMessage.removeListener(onMessage);
              port.disconnect();
            } else {
              const chunk = string2Uint8Array(message.value);
              controller.enqueue(chunk);
            }
          }
        });
        port.postMessage({ url, options } as ProxyFetchRequestMessage);
      },
      cancel(_reason: string) {
        port.disconnect();
      },
    });
  });
}
