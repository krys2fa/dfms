<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const emit = defineEmits(["capture"]);
const videoRef = ref<HTMLVideoElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
let stream: MediaStream | null = null;

onMounted(async () => {
  stream = await navigator.mediaDevices.getUserMedia({ video: true });
  if (videoRef.value) videoRef.value.srcObject = stream;
});

onUnmounted(() => {
  stream?.getTracks().forEach((track) => track.stop());
});

const captureImage = () => {
  const video = videoRef.value!;
  const canvas = canvasRef.value!;
  const context = canvas.getContext("2d")!;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  const image = canvas.toDataURL("image/png");
  emit("capture", image);
};
</script>

<template>
  <div class="relative">
    <video ref="videoRef" autoplay class="w-full rounded-lg"></video>
    <canvas ref="canvasRef" class="hidden"></canvas>
    <button
      @click="captureImage"
      class="mt-2 px-4 py-2 bg-yellow-500 text-white rounded-lg"
    >
      Capture
    </button>
  </div>
</template>
