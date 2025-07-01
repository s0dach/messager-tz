import { defineStore } from "pinia";
import { ref } from "vue";
import type { Message } from "@/types/Message";

function id() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export const useMessageStore = defineStore("messages", () => {
  const messages = ref<Message[]>([]);
  const removedIds = ref<Set<string>>(new Set());

  function add(text: string) {
    messages.value.push({ id: id(), text, createdAt: new Date() });
  }
  function remove(id: string) {
    removedIds.value.add(id);
  }
  function isRemoved(id: string) {
    return removedIds.value.has(id);
  }

  function next(currentId?: string | null): Message | null {
    if (!messages.value.length) return null;
    const startIdx = currentId
      ? messages.value.findIndex((m) => m.id === currentId)
      : -1;

    for (let i = 1; i <= messages.value.length; i++) {
      const idx = (startIdx + i) % messages.value.length;
      const candidate = messages.value[idx];
      if (!isRemoved(candidate.id)) return candidate;
    }
    return null;
  }

  return { messages, removedIds, add, remove, isRemoved, next };
});
