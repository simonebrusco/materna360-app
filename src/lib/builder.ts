// src/lib/builder.ts
import { builder } from '@builder.io/react';

const apiKey = import.meta.env.VITE_BUILDER_API_KEY;

if (!apiKey) {
  console.warn('VITE_BUILDER_API_KEY não definida nas envs da Vercel.');
} else {
  builder.init(apiKey);
}

export { builder };
