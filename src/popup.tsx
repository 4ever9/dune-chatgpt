import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

const Popup = () => {
  const [count, setCount] = useState(0);
  const [currentURL, setCurrentURL] = useState<string>();

  useEffect(() => {
    chrome.action.setBadgeText({ text: count.toString() });
  }, [count]);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      setCurrentURL(tabs[0].url);
    });
  }, []);

  const changeBackground = async () => {
    console.error(222222222222);
    const data = await fetch("https://chat.openai.com/api/auth/session", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((value) => {
        console.log(value);
      })
      .catch((e) => console.error(e));
    // chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    //   const tab = tabs[0];
    //   if (tab.id) {
    //     chrome.tabs.sendMessage(
    //       tab.id,
    //       {
    //         color: "#555555",
    //       },
    //       (msg) => {
    //         console.log("result message:", msg);
    //       }
    //     );
    //   }
    // });
  };

  const [key, setKey] = useState("");

  useEffect(() => {
    chrome.storage.local.get(["key"], function (result) {
      console.log("Value currently is " + result.key);
      setKey(result.key);
    });
  }, []);

  return (
    <>
      <div style={{ minWidth: "300px", padding: "20px" }}>
        <div
          style={{ fontSize: "16px", fontWeight: 500, marginBottom: "20px" }}
        >
          API Key
        </div>
        {/*<li>Current Time: {new Date().toLocaleTimeString()}</li>*/}
        <input
          style={{
            borderRadius: "4px",
            background: "#f2f2f2",
            width: "280px",
            border: "none",
            outline: "none",
            height: "32px",
            padding: "10px",
            marginBottom: "10px",
          }}
          type="text"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
        <div style={{ display: "flex" }}>
          <button
            style={{
              marginLeft: "auto",
              background: "#1e1870",
              borderRadius: "4px",
              border: "none",
              outline: "none",
              width: "60px",
              height: "32px",
              cursor: "pointer",
              color: "#fff",
            }}
            onClick={() => {
              console.log(2222222);
              chrome.storage.local.set({ key: key }, function () {
                console.log("Value is set to " + key);
              });
            }}
          >
            Save
          </button>
        </div>
      </div>
      {/*<button*/}
      {/*  onClick={() => setCount(count + 1)}*/}
      {/*  style={{ marginRight: "5px" }}*/}
      {/*>*/}
      {/*  count up*/}
      {/*</button>*/}
      {/*<button onClick={changeBackground}>change background21</button>*/}
    </>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById("root")
);
