// components/ClientInit.jsx
"use client";

import { useEffect } from "react";
import { initBadgeListener } from "../lib/gamification.js";

export default function ClientInit() {
  useEffect(() => {
    initBadgeListener();
  }, []);
  return null;
}
