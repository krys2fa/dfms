<script setup lang="ts">
import { ref, onMounted } from "vue";
import { SunIcon, MoonIcon, BellIcon, SettingsIcon } from "vue-tabler-icons";
import { useTheme } from "vuetify";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";
const authStore = useAuthStore();
const router = useRouter();

onMounted(async () => {
  const hasSession = await authStore.checkSession();
  if (!hasSession) {
    router.push("/auth/login");
    return;
  }
  await authStore.fetchUser();
});

const theme = useTheme();
const notifications = ref(true);
const accountSettings = ref({
  username: "JohnDoe",
  email: "john@example.com",
});

const toggleTheme = () => {
  theme.global.name.value =
    theme.global.name.value === "light" ? "dark" : "light";
};
</script>

<template>
  <v-container>
    <v-card class="mb-6">
      <v-card-title>
        <SettingsIcon class="mr-2" /> Account Settings
      </v-card-title>
      <v-card-text>
        <v-text-field
          v-model="accountSettings.username"
          label="Username"
        ></v-text-field>
        <v-text-field
          v-model="accountSettings.email"
          label="Email"
        ></v-text-field>
      </v-card-text>
    </v-card>

    <v-card class="mb-6">
      <v-card-title> <BellIcon class="mr-2" /> Notifications </v-card-title>
      <v-card-text>
        <v-switch
          v-model="notifications"
          label="Enable Notifications"
        ></v-switch>
      </v-card-text>
    </v-card>

    <v-card>
      <v-card-title>
        <SunIcon v-if="theme.global.name.value === 'light'" class="mr-2" />
        <MoonIcon v-else class="mr-2" />
        Appearance
      </v-card-title>
      <v-card-text>
        <v-btn @click="toggleTheme">
          {{
            theme.global.name.value === "light"
              ? "Switch to Dark Mode"
              : "Switch to Light Mode"
          }}
        </v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>
