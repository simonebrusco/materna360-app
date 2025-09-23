// src/lib/builder.ts
import { builder } from "@builder.io/sdk";

builder.init(import.meta.env.VITE_BUILDER_API_KEY || "");

export default builder;
