"use client";

import { useCallback, useEffect, useState, startTransition } from "react";

import {
  createDefaultMemory,
  loadMemoryFromStorage,
  mergeLearned,
  removeLearnedItem,
  saveMemoryToStorage,
  setFactsFromArray,
  setWorkHours,
  clearMemoryStorage,
} from "./memory-client";
import type { ProductivityMemory } from "./types";

export function useProductivityMemory() {
  const [memory, setMemory] = useState<ProductivityMemory>(() => createDefaultMemory());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    startTransition(() => {
      setMemory(loadMemoryFromStorage());
      setReady(true);
    });
  }, []);

  const persist = useCallback((updater: (prev: ProductivityMemory) => ProductivityMemory) => {
    setMemory((prev) => {
      const next = updater(prev);
      saveMemoryToStorage(next);
      return next;
    });
  }, []);

  const updateFacts = useCallback((facts: string[]) => {
    persist((prev) => setFactsFromArray(prev, facts));
  }, [persist]);

  const applyLearned = useCallback((additions: string[]) => {
    if (additions.length === 0) {
      return;
    }
    persist((prev) => mergeLearned(prev, additions));
  }, [persist]);

  const removeLearned = useCallback((index: number) => {
    persist((prev) => removeLearnedItem(prev, index));
  }, [persist]);

  const updateWorkHours = useCallback((wh: ProductivityMemory["workHours"]) => {
    persist((prev) => setWorkHours(prev, wh));
  }, [persist]);

  const reset = useCallback(() => {
    clearMemoryStorage();
    setMemory(() => {
      const m = createDefaultMemory();
      saveMemoryToStorage(m);
      return m;
    });
  }, []);

  return {
    memory,
    ready,
    updateFacts,
    applyLearned,
    removeLearned,
    updateWorkHours,
    reset,
  };
}
