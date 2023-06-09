import { uuid } from "./utils";
import { parseSSEResponse } from "./utils/sse";

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  console.log(22222222222222222222222222);
  if (msg.color) {
    console.log("Receive color = " + msg.color);
    document.body.style.backgroundColor = msg.color;
    sendResponse("Change color to " + msg.color);
  } else {
    sendResponse("Color message is none.");
  }
});

console.log("Dune Chatgpt");

(function () {
  setTimeout(async () => {
    // chrome.runtime.sendMessage(
    //   {
    //     contentScriptQuery: "fetchUrl",
    //     url: "https://chat.openai.com/api/auth/session",
    //   },
    //   (response) => {
    //     console.log(response.text);
    //   }
    // );
    // const data = await fetch("https://chat.openai.com/api/auth/session", {
    //   method: "GET",
    // })
    //   .then((res) => res.json())
    //   .catch((e) => console.error(e));
    // console.log(data);

    // chrome.runtime.sendMessage(
    //   {
    //     contentScriptQuery: "fetchUrl",
    //     url: "https://chat.openai.com/backend-api/conversation",
    //     options: {
    //       method: "POST",
    //       signal: AbortSignal,
    //       headers: {
    //         "Content-Type": "application/json",
    //         Authorization: `Bearer ${accessToken}`,
    //       },
    //       body: JSON.stringify({
    //         action: "next",
    //         messages: [
    //           {
    //             id: uuid(),
    //             role: "user",
    //             content: {
    //               content_type: "text",
    //               parts: ["Hello"],
    //             },
    //           },
    //         ],
    //         model: "text-davinci-002-render-sha",
    //         // conversation_id: "50767701-625f-4602-a0a4-adaa08866b6c",
    //         parent_message_id: "7694c459-ea5a-4b2d-ad90-977e8a1c2f1e",
    //       }),
    //     },
    //   },
    //   (response) => {
    //     console.log("fuck", response);
    //     parseSSEResponse(response, (message) => {
    //       console.debug("chatgpt sse message", message);
    //       if (message === "[DONE]") {
    //         // params.onEvent({ type: 'DONE' })
    //         return;
    //       }
    //       let data;
    //       try {
    //         data = JSON.parse(message);
    //       } catch (err) {
    //         console.error(err);
    //         return;
    //       }
    //       const text = data.message?.content?.parts?.[0];
    //       if (text) {
    //         console.log(data.conversation_id);
    //         console.log(data.message.id);
    //         // this.conversationContext = {
    //         //   conversationId: data.conversation_id,
    //         //   lastMessageId: data.message.id,
    //         // }
    //         // params.onEvent({
    //         //   type: 'UPDATE_ANSWER',
    //         //   data: { text },
    //         // })
    //       }
    //     });
    //   }
    // );

    // const resp = await fetch(`https://chat.openai.com/v1/chat/completions`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     model: "chatgpt-3.5-turbo",
    //     messages: [{ role: "user", content: "Hello!" }],
    //     temperature: 0.6,
    //     stream: true,
    //   }),
    // });
    //
    // console.log(resp);

    const $container = document.querySelector("._____slug___content__Yf9Rg");
    if ($container) {
      const $wrapper = document.createElement("div");
      const form = document.createElement("form");
      const $input = document.createElement("input");
      const $result = document.createElement("div");
      $input.setAttribute("id", "gpt-input");
      const $button = document.createElement("button");
      $button.setAttribute("id", "gpt-button");
      $button.innerText = "Query";
      $button.addEventListener("click", function handleClick(event) {
        console.log("element clicked 🎉🎉🎉", event);
        // defaultPrevented()
        event.stopPropagation();
        console.log($input.value);

        chrome.storage.local.get(["key"], function (result) {
          console.log("Value currently is " + result.key);

          const key = result.key;
          chrome.runtime.sendMessage(
            {
              contentScriptQuery: "fetchUrl",
              url: "https://api.openai.com/v1/chat/completions",
              options: {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${key}`,
                },
                body: JSON.stringify({
                  model: "gpt-3.5-turbo",
                  messages: [
                    {
                      role: "user",
                      content:
                        "考虑下面表dex.trades(amount_usd,block_date,blockchain,evt_index,evt_indexmaker,project,project_contract_address,taker,token_bought_symbol,token_pair,token_sold_address,token_sold_amount,token_sold_symbol,trace_address,tx_from,tx_hash,tx_to,token_sold_amount_raw,token_bought_address,token_bought_amount,version,token_bought_amount_raw)。\n" +
                        "\n" +
                        $input.value +
                        "\n" +
                        "只返回代码，不需要进行说明",
                    },
                  ],
                }),
              },
            },
            (response) => {
              const code = response.choices[0].message.content;
              console.log(code);
              $result.innerText = code;
            }
          );
        });
      });

      form.append($input);
      form.append($button);

      $wrapper.append(form);
      $wrapper.append($result);
      $container.prepend($wrapper);
    }
  }, 2000);
})();
