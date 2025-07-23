<template>
  <div
    v-if="visible"
    class="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
    @click.self="close"
  >
    <div class="bg-white rounded-lg p-6 w-[400px] max-h-[90vh] overflow-y-auto text-center">
      <h2 class="text-2xl font-semibold mb-4 text-[#525392]">
        Delete Task
      </h2>

      <p class="mb-6 text-[#353535]">
        Are you sure you want to delete the task <strong>{{ task.title }}</strong>?
      </p>

      <div class="flex gap-4 justify-center">
        <button
          class="flex-1 bg-[#525392] text-white py-2 rounded hover:opacity-90"
          @click="confirmDelete"
          :disabled="isDeleting"
        >
          {{ isDeleting ? 'Deleting...' : 'Delete' }}
        </button>

        <button
          class="flex-1 border border-[#525392] text-[#525392] py-2 rounded hover:bg-[#525392] hover:text-white transition"
          @click="close"
          :disabled="isDeleting"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineProps, defineEmits } from 'vue'
import api from '../services/api'

const props = defineProps<{ visible: boolean; task: { id: number; title: string } }>()
const emit = defineEmits(['close', 'deleted'])

const isDeleting = ref(false)

const close = () => {
  if (!isDeleting.value) emit('close')
}

const confirmDelete = async () => {
  isDeleting.value = true
  try {
    await api.delete(`api/delete-task/${props.task.id}`)
    emit('deleted', props.task.id)
    close()
  } catch (err) {
    console.error('Error deleting task:', err)
  } finally {
    isDeleting.value = false
  }
}
</script>
