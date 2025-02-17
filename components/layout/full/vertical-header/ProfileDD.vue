<script setup lang="ts">
import {
  UserIcon,
  MailIcon,
  ListCheckIcon,
  BellRingingIcon,
} from "vue-tabler-icons";
import { useAuthStore } from "../../../../stores/auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const goToSettings = () => {
  router.push("/settings");
};
</script>

<template>
  <v-row>
    <!-- Notifications Button -->
    <v-btn
      icon
      variant="text"
      class="custom-hover-primary ml-0 ml-md-5 text-muted"
    >
      <v-badge dot color="primary" offset-x="-5" offset-y="-3">
        <BellRingingIcon stroke-width="1.5" size="22" />
      </v-badge>
    </v-btn>
    <!-- Profile Dropdown -->
    <v-menu :close-on-content-click="false">
      <template v-slot:activator="{ props }">
        <v-btn
          class="profileBtn custom-hover-primary"
          variant="text"
          v-bind="props"
          icon
        >
          <v-avatar size="40">
            <img
              src="/images/users/avatar-1.jpg"
              height="40"
              alt="User Avatar"
            />
          </v-avatar>
        </v-btn>
      </template>

      <!-- Dropdown Menu -->
      <v-sheet rounded="md" width="220" elevation="10" class="mt-2">
        <v-list density="compact">
          <v-list-item>
            <template v-slot:prepend>
              <UserIcon stroke-width="1.5" size="20" />
            </template>
            <v-list-item-title class="pl-4">My Profile</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <template v-slot:prepend>
              <MailIcon stroke-width="1.5" size="20" />
            </template>
            <v-list-item-title class="pl-4">My Account</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <template v-slot:prepend>
              <ListCheckIcon stroke-width="1.5" size="20" />
            </template>
            <v-list-item-title class="pl-4">My Tasks</v-list-item-title>
          </v-list-item>

          <v-btn @click="goToSettings" text class="no-border">
            <v-list-item>
              <template v-slot:prepend>
                <SettingsIcon stroke-width="1.5" size="20" />
              </template>
              <v-list-item-title class="pl-4">Settings</v-list-item-title>
            </v-list-item>
          </v-btn>
        </v-list>

        <!-- Logout Button -->
        <div class="py-4 px-5 text-center">
          <v-btn
            color="primary"
            variant="outlined"
            block
            @click="authStore.signOut(router)"
          >
            Logout
          </v-btn>
        </div>
      </v-sheet>
    </v-menu>
  </v-row>
</template>
<style scoped>
.no-border {
  border: none !important;
  box-shadow: none !important;
  padding: 0;
  width: 100%;
}
.custom-hover-primary:hover {
  background-color: rgba(0, 0, 0, 0.05);
}
</style>
