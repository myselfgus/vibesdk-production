# Cloudflare AI Gateway Configuration

This document explains how to configure and use Cloudflare AI Gateway as a provider for multiple AI models in vibesdk.

## Overview

Cloudflare AI Gateway allows you to route AI model requests through a unified gateway, providing benefits like:
- Centralized monitoring and logging
- Rate limiting and caching
- Cost optimization
- Single endpoint for multiple AI providers

## Supported Models

The following models are available through Cloudflare AI Gateway:

### Claude (Anthropic)
- `CLOUDFLARE_GATEWAY_CLAUDE_SONNET_4_5` - Claude Sonnet 4.5 (20250929)
- `CLOUDFLARE_GATEWAY_CLAUDE_HAIKU_4_5` - Claude Haiku 4.5 (20250929)

### OpenAI
- `CLOUDFLARE_GATEWAY_GPT_5` - GPT-5
- `CLOUDFLARE_GATEWAY_GPT_5_CODEX` - GPT-5 Codex

### Grok (xAI)
- `CLOUDFLARE_GATEWAY_GROK_4_FAST` - Grok 4 Fast Reasoning
- `CLOUDFLARE_GATEWAY_GROK_CODE_FAST` - Grok Code Fast

## Environment Configuration

### Required Environment Variables

Add these variables to your `.dev.vars` file (for local development) or Cloudflare Workers secrets (for production):

```bash
# Cloudflare AI Gateway URL
# Example: https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_name}/compat
CLOUDFLARE_AI_GATEWAY_URL=your_gateway_url_here

# Cloudflare AI Gateway Authorization Token
# This is the cf-aig-authorization header value
CLOUDFLARE_AI_GATEWAY_TOKEN=your_gateway_token_here

# Provider-specific API Keys
ANTHROPIC_API_KEY=sk-ant-api03-your-anthropic-key-here
OPENAI_API_KEY=sk-your-openai-key-here
XAI_API_KEY=xai-your-xai-key-here
```

### Configuration Example

Example configuration:

```bash
# Gateway URL (replace with your actual gateway URL)
CLOUDFLARE_AI_GATEWAY_URL=https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_name}/compat

# Gateway Authorization (cf-aig-authorization header - replace with your token)
CLOUDFLARE_AI_GATEWAY_TOKEN=your_cloudflare_gateway_token_here

# API Keys (replace with your actual API keys)
ANTHROPIC_API_KEY=sk-ant-api03-your_anthropic_key_here
XAI_API_KEY=xai-your_xai_key_here
OPENAI_API_KEY=sk-your_openai_key_here
```

## Usage in Agent Configuration

Update your agent configuration in `/worker/agents/inferutils/config.ts`:

```typescript
import { AgentConfig, AIModels } from "./config.types";

export const AGENT_CONFIG: AgentConfig = {
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
    // ... other configurations
};
```

## How It Works

When you use a model with the `cloudflare-gateway/` prefix:

1. The system extracts the provider and model name from the format: `cloudflare-gateway/provider/model`
2. It uses the `CLOUDFLARE_AI_GATEWAY_URL` as the base URL
3. It selects the appropriate API key based on the provider:
   - `anthropic/*` → Uses `ANTHROPIC_API_KEY`
   - `openai/*` → Uses `OPENAI_API_KEY`
   - `grok/*` or `xai/*` → Uses `XAI_API_KEY`
4. It adds the `cf-aig-authorization` header with the `CLOUDFLARE_AI_GATEWAY_TOKEN`

## Model Format

All Cloudflare AI Gateway models follow this format:

```
cloudflare-gateway/{provider}/{model-name}
```

Examples:
- `cloudflare-gateway/anthropic/claude-sonnet-4-5-20250929`
- `cloudflare-gateway/openai/gpt-5`
- `cloudflare-gateway/grok/grok-4-fast-reasoning`

## Setting Up Cloudflare AI Gateway

1. Go to your Cloudflare Dashboard
2. Navigate to AI > AI Gateway
3. Create a new gateway or use an existing one
4. Configure the gateway with the AI providers you want to use
5. Copy the gateway URL (format: `https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_name}/compat`)
6. Copy the authorization token
7. Add these values to your environment variables

## Troubleshooting

### "Invalid API Key" Error
- Verify that you've set the correct API key for the provider you're using
- Check that the API key is not expired or revoked

### "Gateway Not Found" Error
- Verify the `CLOUDFLARE_AI_GATEWAY_URL` is correct
- Ensure the URL includes `/compat` at the end for OpenAI-compatible API format

### "Authorization Failed" Error
- Check that `CLOUDFLARE_AI_GATEWAY_TOKEN` is correctly set
- Verify the token has not expired in your Cloudflare dashboard

## Benefits of Using Cloudflare AI Gateway

1. **Unified Logging**: All AI requests are logged in one place
2. **Cost Tracking**: Monitor and analyze AI costs across providers
3. **Rate Limiting**: Implement custom rate limits per user or endpoint
4. **Caching**: Cache responses to reduce costs and improve performance
5. **Fallback Support**: Built-in fallback to alternative models if primary fails
6. **Analytics**: Detailed analytics on model usage and performance

## Additional Resources

- [Cloudflare AI Gateway Documentation](https://developers.cloudflare.com/ai-gateway/)
- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference)
- [Anthropic API Documentation](https://docs.anthropic.com/claude/reference/getting-started-with-the-api)
- [xAI API Documentation](https://docs.x.ai/api)
