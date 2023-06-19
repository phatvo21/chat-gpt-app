import { DynamicModule, Module } from '@nestjs/common';
import { BaseChatModel } from 'langchain/chat_models';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { HumanChatMessage } from 'langchain/schema';

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

  public static async chat(message: string): Promise<string> {
    const { text } = await this.model.call([new HumanChatMessage(message)]);
    return text;
  }
}
