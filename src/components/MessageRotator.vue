<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useMessageStore } from "../store/messages";

const store = useMessageStore();
const newMessage = ref("");
const currentMessage = ref(store.next() ?? null);

function send() {
  if (!newMessage.value.trim()) return;
  store.add(newMessage.value.trim());
  newMessage.value = "";
}

function remove(id: string) {
  store.remove(id);
  if (currentMessage.value?.id === id) currentMessage.value = store.next();
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
}

let timer: number;

onMounted(() => {
  [
    "Сообщение 1",
    "Сообщение 2",
    "Сообщение 3",
    "Сообщение 4",
    "Сообщение 5",
    "Сообщение 6",
  ].forEach(store.add);
  currentMessage.value = store.next();
  timer = window.setInterval(() => {
    currentMessage.value = store.next(currentMessage.value?.id);
  }, 2000);
});

onUnmounted(() => clearInterval(timer));
</script>

<template>
  <section class="rotator-container">
    <!-- Блок 1 -->
    <div v-if="currentMessage" class="rotator-current">
      <button
        class="icon-btn"
        @click="remove(currentMessage!.id)"
        aria-label="Удалить сообщение"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none">
          <path
            d="M10.0006 9.08597L15.3039 3.78267L16.7181 5.19688L11.4148 10.5002L16.7181 15.8035L15.3039 17.2177L10.0006 11.9144L4.69731 17.2177L3.2831 15.8035L8.5864 10.5002L3.2831 5.19688L4.69731 3.78267L10.0006 9.08597Z"
            fill="#2C674D"
          />
        </svg>
      </button>
      <span class="rotator-text">{{ currentMessage!.text }}</span>
    </div>

    <!-- Блок 2 -->
    <div class="rotator-list">
      <div
        v-for="msg in store.messages"
        :key="msg.id"
        class="rotator-item"
        :class="{ removed: store.isRemoved(msg.id) }"
      >
        <span class="icon-slot">
          <svg
            v-if="store.isRemoved(msg.id)"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M8.00053 6.39989L11.2005 3.19996L12.8004 4.79992L9.60049 7.99986L12.8004 11.1998L11.1998 12.8005L7.99984 9.60052L4.7999 12.8005L3.19993 11.2005L6.39987 8.00055L3.19993 4.80061L4.80059 3.19996L8.00053 6.39989Z"
              fill="#2B312C"
            />
          </svg>
        </span>

        <span class="rotator-text">{{ msg.text }}</span>
      </div>
    </div>

    <!-- Блок 3 / 4 -->
    <form class="rotator-input-group" @submit.prevent="send">
      <input
        v-model="newMessage"
        type="text"
        class="rotator-input"
        placeholder="Новое сообщение"
        aria-label="Новое сообщение"
      />
      <button type="submit" class="rotator-btn">ОТПРАВИТЬ</button>
    </form>
  </section>
</template>
