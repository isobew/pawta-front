<template>
  <div
    class="relative min-w-[170px] max-w-[200px] h-[250px] bg-[#f7f7f7] rounded-lg shadow-md flex flex-col border border-[#525392] cursor-pointer hover:scale-[1.02] transition-transform"
    @click="$emit('select', item)"
  >
    <div class="absolute top-2 left-27 text-[#525392]">
      <button
        @click.stop="$emit('edit', item)"
        class="p-1 hover:text-[#353535]"
        title="Edit"
        aria-label="Edit"
        v-if="showActions && isAdmin"
      >
        <i class="bx bx-edit text-lg"></i>
      </button>
      <button
        @click.stop="$emit('delete', item)"
        class="p-1 hover:text-red-600"
        title="Delete"
        aria-label="Delete"
      >
        <i class="bx bx-trash text-lg"></i>
      </button>
    </div>

    <img
      src="../assets/purplecat.svg"
      alt="avatar"
      class="w-[100px] h-[100px] object-cover mx-auto mt-5"
    />

    <div class="pl-5 pt-9">
      <p class="text-[#525392] font-semibold truncate">{{ item.title }}</p>
      <p class="text-black text-xs">Due in: {{ item.due_in }} days</p>
    </div>

    <div class="w-[80%] mx-auto mt-4 h-2 bg-[#353535]/20 rounded-full">
      <div
        class="h-2 rounded-full transition-all duration-300"
        :class="{
          'w-1/3 bg-[#525392]': item.status === 'to-do',
          'w-2/3 bg-[#525392]': item.status === 'in-progress',
          'w-full bg-[#525392]': item.status === 'finished',
        }"
      ></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  item: {
    id: number
    title: string
    status: 'to-do' | 'in-progress' | 'finished'
    board_name?: string
    due_in?: number
    board_id: number
    assignee_id: number
  }
  showActions?: boolean
  isAdmin?: boolean
}>()

defineEmits(['select', 'edit', 'delete'])
</script>
