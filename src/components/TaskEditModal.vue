<template>
  <div
    v-if="visible"
    class="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
    @click.self="close"
  >
    <div class="bg-white rounded-lg p-6 w-[500px] max-h-[90vh] overflow-y-auto">
      <h2 class="text-2xl font-semibold mb-4 text-[#525392]">
        Edit Task
      </h2>

      <input
        v-model="editedTitle"
        type="text"
        placeholder="Task title"
        class="w-full border border-gray-300 rounded px-3 py-2 text-[#353535] focus:outline-none focus:ring-2 focus:ring-[#525392] mb-4"
        :class="{ 'border-red-500': titleError }"
      />
      <p v-if="titleError" class="text-red-500 text-sm mb-4">Title is required</p>

      <textarea
        v-model="editedDescription"
        placeholder="Description"
        rows="4"
        class="w-full border border-gray-300 rounded px-3 py-2 text-[#353535] focus:outline-none focus:ring-2 focus:ring-[#525392] mb-4"
        :class="{ 'border-red-500': descriptionError }"
      required ></textarea>
      <p v-if="descriptionError" class="text-red-500 text-sm mb-4">Description is required</p>

      <input
        v-model="editedDueDate"
        type="date"
        :min="today"
        class="w-full border border-gray-300 rounded px-3 py-2 text-[#353535] focus:outline-none focus:ring-2 focus:ring-[#525392] mb-4"
        :class="{ 'border-red-500': dueDateError }"
      />
      <p v-if="dueDateError" class="text-red-500 text-sm mb-4">Due date is required and need to be valid</p>

      <select
        v-model="editedStatus"
        class="w-full border border-gray-300 rounded px-3 py-2 text-[#353535] focus:outline-none focus:ring-2 focus:ring-[#525392] mb-4"
      >
        <option value="to-do">To Do</option>
        <option value="in-progress">In Progress</option>
        <option value="finished">Finished</option>
      </select>

      <select
        v-model="editedBoardId"
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
        v-model="editedAssigneeId"
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
          @click="save"
          :disabled="isSaving"
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
import { ref, defineProps, defineEmits, watch, onMounted, computed } from 'vue'
import api from '../services/api'

const props = defineProps<{
  visible: boolean
  task: {
    id: number
    title: string
    description: string
    due_date: string
    status: string
    board_id: number
    assignee_id: number
    board_name: string
    due_in: number
  }
}>()

const emit = defineEmits(['close', 'updated'])

const editedTitle = ref('')
const editedDescription = ref('')
const editedDueDate = ref('')
const editedStatus = ref('to-do')
const editedBoardId = ref<number | ''>('')
const editedAssigneeId = ref<number | ''>('')

const isSaving = ref(false)
const boards = ref<{ id: number; title: string }[]>([])
const users = ref<{ id: number; name: string }[]>([])

const today = new Date().toISOString().split('T')[0]

const titleError = ref(false)
const descriptionError = ref(false)
const dueDateError = ref(false)
const boardError = ref(false)
const assigneeError = ref(false)

watch(
  () => props.task,
  (newTask) => {
    if (newTask) {
      editedTitle.value = newTask.title || ''
      editedDescription.value = newTask.description || ''
      editedDueDate.value = newTask.due_date || ''
      editedStatus.value = newTask.status || 'to-do'
      editedBoardId.value = newTask.board_id || ''
      editedAssigneeId.value = newTask.assignee_id || ''
      // reset errors
      titleError.value = false
      descriptionError.value = false
      dueDateError.value = false
      boardError.value = false
      assigneeError.value = false
    }
  },
  { immediate: true }
)

const close = () => {
  if (!isSaving.value) emit('close')
}

const isValidForm = computed(() => {
  return (
    editedTitle.value.trim() !== '' &&
    editedDescription.value.trim() !== '' &&
    editedDueDate.value !== '' && 
    new Date(editedDueDate.value) > new Date(today) &&
    editedBoardId.value !== '' &&
    editedAssigneeId.value !== ''
  )
})

const save = async () => {
  titleError.value = editedTitle.value.trim() === ''
  descriptionError.value = editedDescription.value.trim() === ''
  dueDateError.value = editedDueDate.value === '' || new Date(editedDueDate.value) < new Date(today)
  boardError.value = editedBoardId.value === ''
  assigneeError.value = editedAssigneeId.value === ''

  console.log(isValidForm)
  if (!isValidForm.value) return

  isSaving.value = true
  try {
    await api.put(`/api/update-task/${props.task.id}`, {
      title: editedTitle.value.trim(),
      description: editedDescription.value.trim(),
      due_date: editedDueDate.value,
      status: editedStatus.value,
      board_id: editedBoardId.value,
      assignee_id: editedAssigneeId.value,
    })

    const response = await api.get(`/api/tasks/${props.task.id}`)

    emit('updated', response.data)
    close()
  } catch (err) {
    console.error('Error updating task:', err)
  } finally {
    isSaving.value = false
  }
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
