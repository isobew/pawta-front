<template>
  <div
    v-if="visible"
    class="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
    @click.self="close"
  >
    <div class="bg-white rounded-lg p-6 w-[400px] max-h-[90vh] overflow-y-auto">
      <h2 class="text-2xl font-semibold mb-4 text-[#525392]">
        Edit Board
      </h2>

      <input
        v-model="editedTitle"
        type="text"
        placeholder="Board title"
        class="w-full border border-gray-300 rounded px-3 py-2 text-[#353535] focus:outline-none focus:ring-2 focus:ring-[#525392]"
      />

      <div class="mt-6 flex gap-4">
        <button
          class="flex-1 bg-[#525392] text-white py-2 rounded hover:opacity-90"
          @click="save"
          :disabled="isSaving || !editedTitle.trim()"
        >
          {{ isSaving ? 'Saving...' : 'Save' }}
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
import { ref, watch, defineProps, defineEmits } from 'vue'
import api from '../../services/api'
import { useToast } from 'vue-toast-notification';

const $toast = useToast();

const props = defineProps<{ visible: boolean; board: { id: number; title: string } }>()
const emit = defineEmits(['close', 'updated'])

const editedTitle = ref('')
const isSaving = ref(false)

watch(
  () => props.board,
  (newBoard) => {
    editedTitle.value = newBoard?.title || ''
  },
  { immediate: true }
)

const close = () => {
  if (!isSaving.value) emit('close')
}

const save = async () => {
  if (!editedTitle.value.trim()) return

  isSaving.value = true
  try {
    const response = await api.put(`api/update-board/${props.board.id}`, {
      title: editedTitle.value.trim(),
    })

    emit('updated', response.data)

    close()
    const msg = 'Board updated successfully!';
    $toast.success(msg);
  } catch (err) {
    const msg = err.response?.data?.message || 'Error.';
    $toast.error(msg);
    console.error('Error updating board:', err)
  } finally {
    isSaving.value = false
  }
}
</script>
