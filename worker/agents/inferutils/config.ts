import { AgentConfig, AIModels } from "./config.types";

/*
Use these configs instead for better performance, less bugs and costs:

    blueprint: {
        name: AIModels.OPENAI_5_MINI,
        reasoning_effort: 'medium',
        max_tokens: 16000,
        fallbackModel: AIModels.OPENAI_O3,
        temperature: 1,
    },
    projectSetup: {
        name: AIModels.OPENAI_5_MINI,
        reasoning_effort: 'medium',
        max_tokens: 10000,
        temperature: 1,
        fallbackModel: AIModels.GEMINI_2_5_FLASH,
    },
    phaseGeneration: {
        name: AIModels.OPENAI_5_MINI,
        reasoning_effort: 'medium',
        max_tokens: 32000,
        temperature: 1,
        fallbackModel: AIModels.GEMINI_2_5_FLASH,
    },
    codeReview: {
        name: AIModels.OPENAI_5,
        reasoning_effort: 'medium',
        max_tokens: 32000,
        temperature: 1,
        fallbackModel: AIModels.GEMINI_2_5_PRO,
    },
    fileRegeneration: {
        name: AIModels.OPENAI_5_MINI,
        reasoning_effort: 'low',
        max_tokens: 32000,
        temperature: 1,
        fallbackModel: AIModels.CLAUDE_4_SONNET,
    },
    realtimeCodeFixer: {
        name: AIModels.OPENAI_5_MINI,
        reasoning_effort: 'low',
        max_tokens: 32000,
        temperature: 1,
        fallbackModel: AIModels.CLAUDE_4_SONNET,
    },

For real time code fixer, here are some alternatives:
    realtimeCodeFixer: {
        name: AIModels.CEREBRAS_QWEN_3_CODER,
        reasoning_effort: undefined,
        max_tokens: 10000,
        temperature: 0.0,
        fallbackModel: AIModels.GEMINI_2_5_PRO,
    },

OR
    realtimeCodeFixer: {
        name: AIModels.KIMI_2_5,
        providerOverride: 'direct',
        reasoning_effort: 'medium',
        max_tokens: 32000,
        temperature: 0.7,
        fallbackModel: AIModels.OPENAI_OSS,
    },

Using Cloudflare AI Gateway with custom providers:
    blueprint: {
        name: AIModels.CLOUDFLARE_GATEWAY_CLAUDE_SONNET_4_5,
        reasoning_effort: 'high',
        max_tokens: 32000,
        temperature: 0.7,
        fallbackModel: AIModels.GEMINI_2_5_PRO,
    },
    phaseImplementation: {
        name: AIModels.CLOUDFLARE_GATEWAY_GPT_5,
        reasoning_effort: 'medium',
        max_tokens: 64000,
        temperature: 0.2,
        fallbackModel: AIModels.GEMINI_2_5_PRO,
    },
    realtimeCodeFixer: {
        name: AIModels.CLOUDFLARE_GATEWAY_GROK_CODE_FAST,
        reasoning_effort: 'low',
        max_tokens: 32000,
        temperature: 0.1,
        fallbackModel: AIModels.GEMINI_2_5_FLASH,
    },
*/


export const AGENT_CONFIG: AgentConfig = {
    templateSelection: {
        name: AIModels.CLOUDFLARE_GATEWAY_CLAUDE_HAIKU_4_5,
        max_tokens: 2000,
        fallbackModel: AIModels.XAI_GROK_CODE_FAST,
        temperature: 0.6,
    },
    blueprint: {
        name: AIModels.CLOUDFLARE_GATEWAY_CLAUDE_SONNET_4_5,
        reasoning_effort: 'high',
        max_tokens: 64000,
        fallbackModel: AIModels.CLOUDFLARE_GATEWAY_GROK_4_FAST,
        temperature: 0.7,
    },
    projectSetup: {
        name: AIModels.CLOUDFLARE_GATEWAY_CLAUDE_SONNET_4_5,
        reasoning_effort: 'low',
        max_tokens: 10000,
        temperature: 0.2,
        fallbackModel: AIModels.CLOUDFLARE_GATEWAY_GROK_4_STANDARD,
    },
    phaseGeneration: {
        name: AIModels.CLOUDFLARE_GATEWAY_CLAUDE_SONNET_4_5,
        reasoning_effort: 'medium',
        max_tokens: 32000,
        temperature: 0.2,
        fallbackModel: AIModels.CLOUDFLARE_GATEWAY_GROK_4_FAST,
    },
    firstPhaseImplementation: {
        name: AIModels.CLOUDFLARE_GATEWAY_CLAUDE_SONNET_4_5,
        reasoning_effort: 'medium',
        max_tokens: 64000,
        temperature: 0.2,
        fallbackModel: AIModels.CLOUDFLARE_GATEWAY_GROK_4_STANDARD,
    },
    phaseImplementation: {
        name: AIModels.CLOUDFLARE_GATEWAY_CLAUDE_SONNET_4_5,
        reasoning_effort: 'medium',
        max_tokens: 64000,
        temperature: 0.2,
        fallbackModel: AIModels.CLOUDFLARE_GATEWAY_GROK_4_STANDARD,
    },
    realtimeCodeFixer: {
        name: AIModels.CLOUDFLARE_GATEWAY_GROK_CODE_FAST,
        reasoning_effort: 'low',
        max_tokens: 32000,
        temperature: 0.1,
        fallbackModel: AIModels.CLAUDE_HAIKU_4_5,
    },
    // Not used right now
    fastCodeFixer: {
        name: AIModels.CLOUDFLARE_GATEWAY_GROK_CODE_FAST,
        reasoning_effort: undefined,
        max_tokens: 64000,
        temperature: 0.0,
        fallbackModel: AIModels.CLAUDE_SONNET_4_5,
    },
    conversationalResponse: {
        name: AIModels.CLAUDE_HAIKU_4_5,
        reasoning_effort: 'low',
        max_tokens: 4000,
        temperature: 0,
        fallbackModel: AIModels.CLOUDFLARE_GATEWAY_GROK_CODE_FAST,
    },
    deepDebugger: {
        name: AIModels.CLOUDFLARE_GATEWAY_CLAUDE_SONNET_4_5,
        reasoning_effort: 'high',
        max_tokens: 8000,
        temperature: 0.5,
        fallbackModel: AIModels.CLOUDFLARE_GATEWAY_GROK_4_FAST,
    },
    codeReview: {
        name: AIModels.CLOUDFLARE_GATEWAY_CLAUDE_SONNET_4_5,
        reasoning_effort: 'high',
        max_tokens: 32000,
        temperature: 0.1,
        fallbackModel: AIModels.CLOUDFLARE_GATEWAY_GROK_4_FAST,
    },
    fileRegeneration: {
        name: AIModels.CLOUDFLARE_GATEWAY_CLAUDE_SONNET_4_5,
        reasoning_effort: 'medium',
        max_tokens: 32000,
        temperature: 0,
        fallbackModel: AIModels.CLOUDFLARE_GATEWAY_GROK_4_STANDARD,
    },
    // Not used right now
    screenshotAnalysis: {
        name: AIModels.CLOUDFLARE_GATEWAY_CLAUDE_SONNET_4_5,
        reasoning_effort: 'high',
        max_tokens: 8000,
        temperature: 0.1,
        fallbackModel: AIModels.CLOUDFLARE_GATEWAY_GROK_4_FAST,
    },
};


// Model validation utilities
export const ALL_AI_MODELS: readonly AIModels[] = Object.values(AIModels);
export type AIModelType = AIModels;

// Create tuple type for Zod enum validation
export const AI_MODELS_TUPLE = Object.values(AIModels) as [AIModels, ...AIModels[]];

export function isValidAIModel(model: string): model is AIModels {
    return Object.values(AIModels).includes(model as AIModels);
}

export function getValidAIModelsArray(): readonly AIModels[] {
    return ALL_AI_MODELS;
}
