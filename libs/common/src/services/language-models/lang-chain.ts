import { DynamicModule, Module } from '@nestjs/common';
import { BaseChatModel } from 'langchain/chat_models';
import { ChatOpenAI } from 'langchain/chat_models/openai';
// import { BaseChatMessage, HumanChatMessage } from 'langchain/schema';

@Module({})
export class LangChain {
  public static model: BaseChatModel;

  public static init(): DynamicModule {
    this.model = new ChatOpenAI({
      temperature: 0.9,
      openAIApiKey: process.env.OPEN_API_KEY,
    });

    return {
      module: LangChain,
      global: true,
    };
  }

  // TODO: Since the ChatGPT API Key is required to be paid, so need to have a valid key to send the message
  public static async chat(message: string): Promise<any> {
    return `That is good mate ${message}`;
    // await this.model.call([new HumanChatMessage(message)]);
  }
}
