import Tab = chrome.tabs.Tab;
import { RequestInitSubset } from "./types/messaging";
import { proxyFetch } from "./proxy-fetch";

export const CHATGPT_HOME_URL = "https://chat.openai.com/chat";

class ProxyFetchRequester {
  async findExistingProxyTab() {
    const tabs = await chrome.tabs.query({ pinned: true });
    return tabs.find((tab) => tab.url?.startsWith("https://chat.openai.com"));
  }

  waitForProxyTabReady(onReady: (tab: Tab) => void) {
    chrome.runtime.onMessage.addListener(async function listener(
      message,
      sender
    ) {
      if (message.event === "PROXY_TAB_READY") {
        console.debug("new proxy tab ready");
        chrome.runtime.onMessage.removeListener(listener);
        onReady(sender.tab!);
      }
    });
  }

  async createProxyTab() {
    return new Promise<Tab>((resolve) => {
      this.waitForProxyTabReady(resolve);
      chrome.tabs.create({ url: CHATGPT_HOME_URL, pinned: true });
    });
  }

  async getProxyTab() {
    let tab = await this.findExistingProxyTab();
    if (!tab) {
      tab = await this.createProxyTab();
    }
    return tab;
  }

  async refreshProxyTab() {
    const tab = await this.findExistingProxyTab();
    if (!tab) {
      await this.createProxyTab();
      return;
    }
    await chrome.tabs.update(tab.id!, { active: true });
    return new Promise<Tab>((resolve) => {
      this.waitForProxyTabReady(resolve);
      chrome.tabs.reload(tab.id!);
    });
  }

  async fetch(url: string, options?: RequestInitSubset) {
    const tab = await this.getProxyTab();
    return proxyFetch(tab.id!, url, options);
  }
}

const proxyFetchRequester = new ProxyFetchRequester();
export default proxyFetchRequester;
