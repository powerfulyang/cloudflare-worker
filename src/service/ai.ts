import { app } from '@/server';
import { Ai, modelMappings } from '@cloudflare/ai';
import { AiTextGenerationInput } from '@cloudflare/ai/dist/tasks/text-generation';

app.post('/api/speech-recognition', async c => {
  const ai = new Ai(c.env.AI);
  const blob = await c.req.arrayBuffer();
  const inputs = {
    audio: Array.from(new Uint8Array(blob)),
  };
  const response = await ai.run(
    modelMappings['speech-recognition'].models[0],
    inputs,
  );
  return c.json({ response });
});

app.post('/api/text-generation', async c => {
  const ai = new Ai(c.env.AI);
  const inputs: AiTextGenerationInput = await c.req.json();
  const response = await ai.run(
    modelMappings['text-generation'].models[0],
    inputs,
  );
  return c.json({ response });
});
