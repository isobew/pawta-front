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
      />

      <textarea
        v-model="editedDescription"
        placeholder="Description"
        rows="4"
        class="w-full border border-gray-300 rounded px-3 py-2 text-[#353535] focus:outline-none focus:ring-2 focus:ring-[#525392] mb-4"
      ></textarea>

      <input
        v-model="editedDueDate"
        type="date"
        class="w-full border border-gray-300 rounded px-3 py-2 text-[#353535] focus:outline-none focus:ring-2 focus:ring-[#525392] mb-4"
      />

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
      >
        <option disabled value="">Select Board</option>
        <option v-for="board in boards" :key="board.id" :value="board.id">
          {{ board.title }}
        </option>
      </select>

      <select
        v-model="editedAssigneeId"
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
import { ref, defineProps, defineEmits, watch, onMounted } from 'vue'
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
    }
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
    const response = await api.put(`/api/update-task/${props.task.id}`, {
      title: editedTitle.value.trim(),
      description: editedDescription.value.trim(),
      due_date: editedDueDate.value,
      status: editedStatus.value,
      board_id: editedBoardId.value,
      assignee_id: editedAssigneeId.value,
    })

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
