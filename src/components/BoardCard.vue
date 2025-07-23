<template>
  <div class="min-w-[149px] max-w-[200px] h-[180px] bg-[#f7f7f7] rounded-lg shadow-md text-[#525392] flex flex-col items-center justify-evenly text-center border border-[#525392]"
  @click="$emit('select', item)">
    <img
        src="../assets/purplecat.svg"
        alt="avatar"
        class="w-[100px] h-[100px] object-cover"
    />
    {{ item.title }}
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  item: {
    title: string
  }
}>()

defineEmits(['select'])
</script>
