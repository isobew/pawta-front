<template>
  <div
    v-if="visible"
    class="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
    @click.self="close"
  >
    <div class="bg-white rounded-lg p-6 w-[400px] max-h-[90vh] overflow-y-auto">
      <h2 class="text-2xl font-semibold mb-4 text-[#525392]">
        Create Board
      </h2>

      <input
        v-model="title"
        type="text"
        placeholder="Board title"
        class="w-full border border-gray-300 rounded px-3 py-2 text-[#353535] focus:outline-none focus:ring-2 focus:ring-[#525392]"
      />

      <div class="mt-6 flex gap-4">
        <button
          class="flex-1 bg-[#525392] text-white py-2 rounded hover:opacity-90"
          @click="create"
          :disabled="isSaving || !title.trim()"
        >
          {{ isSaving ? 'Creating...' : 'Create' }}
        </button>

        <button
          class="flex-1 border border-[#525392] text-[#525392] py-2 rounded hover:bg-[#525392] hover:text-white transition"
          @click="close"
          :disabled="isSaving"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineProps, defineEmits } from 'vue'
import api from '../../services/api'

const props = defineProps<{ visible: boolean }>()
const emit = defineEmits(['close', 'created'])

const title = ref('')
const isSaving = ref(false)

const close = () => {
  if (!isSaving.value) emit('close')
}

const create = async () => {
  if (!title.value.trim()) return

  isSaving.value = true
  try {
    const response = await api.post('/api/create-board', {
      title: title.value.trim(),
    })

    emit('created', response.data)
    title.value = ''
    close()
  } catch (err) {
    console.error('Error creating board:', err)
  } finally {
    isSaving.value = false
  }
}
</script>
