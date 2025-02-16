<script setup lang="ts">
import Sidebar from "../components/SideBar.vue";
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
import { useAuthStore } from "../stores/auth";
import { ref, onMounted } from "vue";

const { fetchUser, signOut } = useAuthStore();

onMounted(async () => {
  await fetchUser();
});

const title = ref("Digital Fuel Management System");
useHead({
  meta: [{ content: title }],
  titleTemplate: (titleChunk) => {
    return titleChunk
      ? `${titleChunk} - Digital Fuel Management System`
      : "Digital Fuel Management System";
  },
});
</script>

<template>
  <v-locale-provider>
    <v-app>
      <LayoutFullMain />
      <v-main>
        <v-container fluid class="page-wrapper">
          <div class="maxWidth">
            <NuxtPage />
          </div>
        </v-container>
      </v-main>
    </v-app>
  </v-locale-provider>
</template>
