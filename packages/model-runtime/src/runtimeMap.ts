// Only OpenAI provider is enabled
import { LobeOpenAI } from './providers/openai';

export const providerRuntimeMap = {
  openai: LobeOpenAI,
};
