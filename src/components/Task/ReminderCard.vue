<template>
  <div
    class="min-w-[280px] max-w-[350px] h-[170px] bg-[#f7f7f7] rounded-lg shadow-md flex flex-col justify-between border-3 border-[#525392] cursor-pointer hover:scale-[1.02] transition-transform"
    @click="$emit('select', item)"
  >
    <div class="mx-auto bg-[#525392] max-w-[100px] text-[#f7f7f7] text-sm px-2 rounded-b-md truncate">
      {{ item.board_name }}
    </div>
    <div class="px-5">
      <p class="text-[#525392] text-2xl truncate">{{ item.title }}</p>
      <div class="flex items-end justify-between">
        <p class="text-[#353535E6] text-sm">{{ status }}</p>
        <p class="text-black text-sm truncate">Due in: {{ item.due_in }} days</p>
      </div>
    </div>

    <div class="w-[90%] mx-auto mb-3 h-2 bg-[#353535]/20 rounded-full">
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

const statusMap: Record<'to-do' | 'in-progress' | 'done', string> = {
  'to-do': 'Pending',
  'in-progress': 'In progress',
  'done': 'Completed'
}

const status = statusMap[__props.item.status]
</script>
