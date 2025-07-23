<template>
  <div
    v-if="visible"
    class="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
    @click.self="close"
  >
    <div class="bg-white rounded-lg p-6 w-[400px] max-h-[90vh] overflow-y-auto">
      <h2 class="text-2xl font-semibold mb-4 text-[#525392]">
        {{ task.title }}
      </h2>

      <p class="text-sm text-gray-700 mb-2">
        <span class="font-semibold">Description:</span>
        {{ task.description || 'No description' }}
      </p>

      <p class="text-sm text-gray-700 mb-2">
        <span class="font-semibold">Status:</span>
        {{ status }}
      </p>

      <p class="text-sm text-gray-700 mb-2">
        <span class="font-semibold">Due date:</span>
        {{ task.due_date || 'Not set' }}
      </p>

      <p class="text-sm text-gray-700">
        <span class="font-semibold">Board:</span>
        {{ task.board_name || 'Unknown' }}
      </p>

      <button
        class="mt-6 w-full bg-[#525392] text-white py-2 rounded hover:opacity-90"
        @click="close"
      >
        Close
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue'

defineProps<{ visible: boolean; task: any }>()
const emit = defineEmits(['close'])

const close = () => emit('close')

const statusMap: Record<'to-do' | 'in-progress' | 'done', string> = {
  'to-do': 'Pending',
  'in-progress': 'In progress',
  'done': 'Completed'
}

const status = statusMap[__props.task.status]
</script>
