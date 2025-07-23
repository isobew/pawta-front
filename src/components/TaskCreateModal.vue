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
        :class="{ 'border-red-500': titleError }"
      />
      <p v-if="titleError" class="text-red-500 text-sm mb-4">Title is required</p>

      <textarea
        v-model="description"
        placeholder="Description"
        rows="4"
        class="w-full border border-gray-300 rounded px-3 py-2 text-[#353535] focus:outline-none focus:ring-2 focus:ring-[#525392] mb-4"
        :class="{ 'border-red-500': descriptionError }"
      ></textarea>
      <p v-if="descriptionError" class="text-red-500 text-sm mb-4">Description is required</p>

      <input
        v-model="dueDate"
        type="date"
        :min="today"
        class="w-full border border-gray-300 rounded px-3 py-2 text-[#353535] focus:outline-none focus:ring-2 focus:ring-[#525392] mb-4"
        :class="{ 'border-red-500': dueDateError }"
      />
      <p v-if="dueDateError" class="text-red-500 text-sm mb-4">Due date is required and need to be valid</p>

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
        :class="{ 'border-red-500': boardError }"
      >
        <option disabled value="">Select Board</option>
        <option v-for="board in boards" :key="board.id" :value="board.id">
          {{ board.title }}
        </option>
      </select>
      <p v-if="boardError" class="text-red-500 text-sm mb-4">Board is required</p>

      <select
        v-model="assigneeId"
        class="w-full border border-gray-300 rounded px-3 py-2 text-[#353535] focus:outline-none focus:ring-2 focus:ring-[#525392] mb-6"
        :class="{ 'border-red-500': assigneeError }"
      >
        <option disabled value="">Assign to</option>
        <option v-for="user in users" :key="user.id" :value="user.id">
          {{ user.name }}
        </option>
      </select>
      <p v-if="assigneeError" class="text-red-500 text-sm mb-6">Assignee is required</p>

      <div class="flex gap-4">
        <button
          class="flex-1 bg-[#525392] text-white py-2 rounded hover:opacity-90"
          @click="create"
          :disabled="isSaving"
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
import { ref, defineProps, defineEmits, onMounted, computed } from 'vue'
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

const today = new Date().toISOString().split('T')[0]

// Validation errors
const titleError = ref(false)
const descriptionError = ref(false)
const dueDateError = ref(false)
const boardError = ref(false)
const assigneeError = ref(false)

const close = () => {
  if (!isSaving.value) emit('close')
}

const isValidForm = computed(() => {
  return (
    title.value.trim() !== '' &&
    description.value.trim() !== '' &&
    dueDate.value !== '' &&
    new Date(dueDate.value) > new Date(today) &&
    boardId.value !== '' &&
    assigneeId.value !== ''
  )
})

const create = async () => {
  titleError.value = title.value.trim() === ''
  descriptionError.value = description.value.trim() === ''
  dueDateError.value = dueDate.value === '' || new Date(dueDate.value) < new Date(today)
  boardError.value = boardId.value === ''
  assigneeError.value = assigneeId.value === ''

  if (!isValidForm.value) return

  isSaving.value = true
  try {
    const item_task = await api.post('/api/create-task', {
      title: title.value.trim(),
      description: description.value.trim(),
      due_date: dueDate.value,
      status: status.value,
      board_id: boardId.value,
      assignee_id: assigneeId.value,
      creator_id: props.creatorId,
    })

    const response = await api.get(`/api/tasks/${item_task.data.id}`)

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
  titleError.value = false
  descriptionError.value = false
  dueDateError.value = false
  boardError.value = false
  assigneeError.value = false
}

onMounted(async () => {
  try {
    const [boardsRes, usersRes] = await Promise.all([
      api.get('/api/boards'),
      api.get('/api/users'),
    ])
    boards.value = boardsRes.data.data
    users.value = usersRes.data
  } catch (err) {
    console.error('Erro ao carregar boards ou usuários:', err)
  }
})
</script>
