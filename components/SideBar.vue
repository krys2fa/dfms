<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: "📊" },
  { name: "Transactions", path: "/transactions", icon: "💰" },
  { name: "Reports", path: "/reports", icon: "📑" },
  { name: "Settings", path: "/settings", icon: "⚙️" },
];

const isOpen = ref(true);
</script>

<template>
  <aside
    class="bg-gray-900 text-white h-screen p-4 transition-all duration-300"
    :class="isOpen ? 'w-64' : 'w-20'"
  >
    <!-- Toggle Button -->
    <button
      class="mb-6 text-white focus:outline-none"
      @click="isOpen = !isOpen"
    >
      {{ isOpen ? "⬅️" : "➡️" }}
    </button>

    <!-- Menu -->
    <nav>
      <ul>
        <li
          v-for="item in menuItems"
          :key="item.path"
          @click="router.push(item.path)"
          class="p-3 flex items-center space-x-2 hover:bg-gray-800 cursor-pointer rounded-lg transition"
        >
          <span class="text-lg">{{ item.icon }}</span>
          <span v-if="isOpen">{{ item.name }}</span>
        </li>
      </ul>
    </nav>
  </aside>
</template>
