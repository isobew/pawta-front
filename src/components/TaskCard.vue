<template>
  <div
    class="min-w-[170px] max-w-[200px] h-[250px] bg-[#f7f7f7] rounded-lg shadow-md flex flex-col border-3 border-[#525392] cursor-pointer hover:scale-[1.02] transition-transform"
    @click="$emit('select', item)"
  >
    <div class="mx-auto bg-[#525392] max-w-[100px] text-[#f7f7f7] text-sm px-2 rounded-b-md">
      {{ item.board_name }}
    </div>

    <img
      src="../assets/purplecat.svg"
      alt="avatar"
      class="w-[100px] h-[100px] object-cover mx-auto mt-5"
    />

    <div class="pl-5 pt-9">
      <p class="text-[#525392] font-semibold">{{ item.title }}</p>
      <p class="text-black text-xs">Due in: {{ item.due_in }} days</p>
    </div>

    <div class="w-[80%] mx-auto mt-4 h-2 bg-[#353535]/20 rounded-full">
      <div
        class="h-2 rounded-full transition-all duration-300"
        :class="{
          'w-1/3 bg-[#525392]': item.status === 'to-do',
          'w-2/3 bg-[#525392]': item.status === 'in-progress',
          'w-full bg-[#525392]': item.status === 'done',
        }"
      ></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  item: {
    title: string
    status: 'to-do' | 'in-progress' | 'done'
    board_name?: string
    due_in?: number
  }
}>()

defineEmits(['select'])
</script>
