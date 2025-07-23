<template>
  <div
    v-if="visible"
    class="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
    @click.self="close"
  >
    <div class="bg-white rounded-lg p-6 w-[500px] max-h-[90vh] overflow-y-auto">
      <h2 class="text-2xl font-semibold mb-4 text-[#525392]">
        Create Task
      </h2>

      <input
        v-model="title"
        type="text"
        placeholder="Task title"
        class="w-full border border-gray-300 rounded px-3 py-2 text-[#353535] focus:outline-none focus:ring-2 focus:ring-[#525392] mb-4"
      />

      <textarea
        v-model="description"
        placeholder="Description"
        rows="4"
        class="w-full border border-gray-300 rounded px-3 py-2 text-[#353535] focus:outline-none focus:ring-2 focus:ring-[#525392] mb-4"
      ></textarea>

      <input
        v-model="dueDate"
        type="date"
        class="w-full border border-gray-300 rounded px-3 py-2 text-[#353535] focus:outline-none focus:ring-2 focus:ring-[#525392] mb-4"
      />

      <select
        v-model="status"
        class="w-full border border-gray-300 rounded px-3 py-2 text-[#353535] focus:outline-none focus:ring-2 focus:ring-[#525392] mb-4"
      >
        <option value="to-do">To Do</option>
        <option value="in-progress">In Progress</option>
        <option value="finished">Finished</option>
      </select>

      <select
        v-model="boardId"
        class="w-full border border-gray-300 rounded px-3 py-2 text-[#353535] focus:outline-none focus:ring-2 focus:ring-[#525392] mb-4"
      >
        <option disabled value="">Select Board</option>
        <option v-for="board in boards" :key="board.id" :value="board.id">
          {{ board.title }}
        </option>
      </select>

      <select
        v-model="assigneeId"
        class="w-full border border-gray-300 rounded px-3 py-2 text-[#353535] focus:outline-none focus:ring-2 focus:ring-[#525392] mb-6"
      >
        <option disabled value="">Assign to</option>
        <option v-for="user in users" :key="user.id" :value="user.id">
          {{ user.name }}
        </option>
      </select>

      <div class="flex gap-4">
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
import { ref, defineProps, defineEmits, onMounted } from 'vue'
import api from '../services/api'

const props = defineProps<{ visible: boolean; creatorId: number }>()
const emit = defineEmits(['close', 'created'])

const title = ref('')
const description = ref('')
const dueDate = ref('')
const status = ref('to-do')
const boardId = ref('')
const assigneeId = ref('')
const isSaving = ref(false)

const boards = ref<{ id: number; title: string }[]>([])
const users = ref<{ id: number; name: string }[]>([])

const close = () => {
  if (!isSaving.value) emit('close')
}

const create = async () => {
  if (!title.value.trim()) return

  isSaving.value = true
  try {
    const response = await api.post('/api/create-task', {
      title: title.value.trim(),
      description: description.value.trim(),
      due_date: dueDate.value,
      status: status.value,
      board_id: boardId.value,
      assignee_id: assigneeId.value,
      creator_id: props.creatorId,
    })

    emit('created', response.data)
    resetForm()
    close()
  } catch (err) {
    console.error('Error creating task:', err)
  } finally {
    isSaving.value = false
  }
}

const resetForm = () => {
  title.value = ''
  description.value = ''
  dueDate.value = ''
  status.value = 'to-do'
  boardId.value = ''
  assigneeId.value = ''
}

onMounted(async () => {
  try {
    const [boardsRes, usersRes] = await Promise.all([
      api.get('/api/boards'),
      api.get('/api/users'),
    ])
    boards.value = boardsRes.data.data
    users.value = usersRes.data

    console.log(usersRes.data)
  } catch (err) {
    console.error('Erro ao carregar boards ou usuários:', err)
  }
})
</script>
