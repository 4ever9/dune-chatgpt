const checkAuth = async () => {
  console.log("Check chatgpt auth");
  console.log(await chrome.storage.sync.get());
  chrome.storage.local.get(["key"], function (result) {
    console.log("Value currently is " + result.key);
  });
  setTimeout(checkAuth, 3000);
};

checkAuth();

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.contentScriptQuery == "fetchUrl") {
    // WARNING: SECURITY PROBLEM - a malicious web page may abuse
    // the message handler to get access to arbitrary cross-origin
    // resources.
    fetch(request.url, request.options)
      .then((res) => res.json())
      .then((text) => sendResponse(text))
      .catch((error) => console.error(error));
    return true; // Will respond asynchronously.
  }
});
