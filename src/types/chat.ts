export interface ChatMessageModel {
  id: string;
  author: "user";
  text: string;
  error?: Error;
}

export interface ConversationModel {
  messages: ChatMessageModel[];
}
