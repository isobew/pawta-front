<template>
  <div class="p-10 w-[80vw] min-h-screen">
    <div class="flex flex-col md:flex-row justify-between items-center mb-4 gap-5">
      <h1 class="text-2xl sm:mb-5 text-white">{{ board?.title || 'Loading...' }}</h1>
      <div class="justify-end pr-12" v-if="userIsAdmin">
        <button id="auth-btn"
            @click="showCreateModal = true"
            class="min-h-[2.5em] min-w-[50px] text-dark font-bold text-lg rounded-full cursor-pointer mb-8">
            + Create task</button>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-6">
      <Column
        title="To do"
        status="to-do"
        :tasks="tasks"
        :showActions="true"
        :isAdmin="userIsAdmin"
        @taskMoved="onTaskMoved"
        @edit="openEditModal"
        @delete="openDeleteModal"
        @select="openModal"
      />

      <Column
        title="In progress"
        status="in-progress"
        :tasks="tasks"
        :showActions="true"
        :isAdmin="userIsAdmin"
        @taskMoved="onTaskMoved"
        @edit="openEditModal"
        @delete="openDeleteModal"
        @select="openModal"
      />

      <Column
        title="Finished"
        status="finished"
        :tasks="tasks"
        :showActions="true"
        :isAdmin="userIsAdmin"
        @taskMoved="onTaskMoved"
        @edit="openEditModal"
        @delete="openDeleteModal"
        @select="openModal"
      />

    </div>

     <!-- Modais -->
    <TaskEditModal
      v-if="selectedTaskToEdit"
      :visible="showEditModal"
      :task="selectedTaskToEdit"
      @close="closeEditModal"
      @updated="handleTaskUpdated"
    />

    <TaskDeleteModal
      v-if="selectedTaskToDelete"
      :visible="showDeleteModal"
      :task="selectedTaskToDelete"
      @close="closeDeleteModal"
      @deleted="handleTaskDeleted"
    />

    <TaskCreateModal
      :visible="showCreateModal"
      @close="showCreateModal = false"
      @created="handleTaskCreated"
      :creator-id="user.id"
    />

    <TaskDetailsModal
      v-if="selectedTask"
      :visible="showModal"
      :task="selectedTask"
      @close="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '../services/api';

import Column from '../components/Column.vue';
import TaskDeleteModal from '../components/TaskDeleteModal.vue';
import TaskEditModal from '../components/TaskEditModal.vue';
import TaskDetailsModal from '../components/TaskDetailsModal.vue';
import TaskCreateModal from '../components/TaskCreateModal.vue';

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  creator_id: string;
  createdAt: string;
  due_date: string;
  assignee_id?: string;
}

interface Board {
  id: string;
  title: string;
  description: string;
}

const route = useRoute();
const board = ref<Board | null>(null);
const tasks = ref<Task[]>([]);

const userIsAdmin = ref(true)

const selectedTaskToEdit = ref(null)
const showEditModal = ref(false)

const selectedTaskToDelete = ref(null)
const showDeleteModal = ref(false)

const showCreateModal = ref(false)

const showModal = ref(false)
const selectedTask = ref(null)

const openModal = (task: any) => {
  selectedTask.value = task
  showModal.value = true
}
const closeModal = () => {
  showModal.value = false
  selectedTask.value = null
}

const openEditModal = (task: any) => {
  selectedTaskToEdit.value = task
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  selectedTaskToEdit.value = null
}

const openDeleteModal = (task: any) => {
  selectedTaskToDelete.value = task
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  selectedTaskToDelete.value = null
}

// Simulação do usuário logado
const user = ref({ id: 1 })

const fetchBoardWithTasks = async () => {
  try {
    const boardId = route.params.id;
    const res = await api.get(`/api/board/${boardId}`);
    board.value = res.data.board;
    tasks.value = res.data.tasks || [];
    console.log(tasks.value[0])
  } catch (error) {
    console.error('Erro ao buscar o quadro com tarefas:', error);
  }
};

const updateTaskStatus = async (id: string, status: string) => {
  try {
    await api.put(`/api/update-task/${id}`, { status });
    await fetchBoardWithTasks();
  } catch (error: any) {
    console.error('Erro ao mover tarefa', error);
  }
};

const onTaskMoved = ({ id, status }: { id: string; status: string }) => {
  updateTaskStatus(id, status);
};

const confirmAndDelete = async () => {
  if (selectedTaskToDelete.value) {
    try {
      await api.delete(`/api/delete-task/${selectedTaskToDelete.value.id}`);
      await fetchBoardWithTasks();
      closeDeleteModal();
    } catch (error) {
      console.error('Erro ao deletar tarefa');
    }
  }
};

onMounted(fetchBoardWithTasks);

const handleTaskCreated = () => {
  fetchBoardWithTasks();
  showCreateModal.value = false;
};
</script>
