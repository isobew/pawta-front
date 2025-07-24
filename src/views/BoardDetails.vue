<template>
  <div class="p-10 w-[80vw] min-h-screen">
    <div class="flex flex-col md:flex-row justify-between items-center mb-4 gap-5">
      <h1 class="text-2xl sm:mb-5 text-white">{{ board?.title || 'Carregando...' }}</h1>
      <button @click="showCreateModal = true" class="text-white px-4 py-2 rounded bg-[#525392] hover:bg-[#403f7a]">+ Tarefa</button>
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

    <TaskFormModal
      v-if="showCreateModal || selectedTaskToEdit"
      :task="selectedTaskToEdit"
      :board-id="board?.id"
      :creator-id="userId"
      @close="closeCreateOrEditModal"
      @refresh="fetchBoardWithTasks"
    />

    <ConfirmDeleteModal
      v-if="showDeleteModal"
      :task="selectedTaskToDelete"
      @cancel="closeDeleteModal"
      @confirm="confirmAndDelete"
    />

    <InfoModal
      v-if="showModal"
      :task="selectedTask"
      @cancel="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '../services/api';

import Column from '../components/Column.vue';
import TaskFormModal from '../components/TaskFormModal.vue';
import ConfirmDeleteModal from '../components/TaskDeleteModal.vue';
import InfoModal from '../components/TaskDetailsModal.vue';

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

const selectedTask = ref<Task | null>(null);
const selectedTaskToEdit = ref<Task | null>(null);
const selectedTaskToDelete = ref<Task | null>(null);

const showCreateModal = ref(false);
const showDeleteModal = ref(false);
const showModal = ref(false);

// Simula o ID do usuário logado 
const userId = 1;

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

const openModal = (task: Task) => {
  selectedTask.value = task;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedTask.value = null;
};

const openEditModal = (task: Task) => {
  selectedTaskToEdit.value = task;
};

const openDeleteModal = (task: Task) => {
  selectedTaskToDelete.value = task;
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  selectedTaskToDelete.value = null;
  showDeleteModal.value = false;
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

const closeCreateOrEditModal = () => {
  selectedTaskToEdit.value = null;
  showCreateModal.value = false;
};

onMounted(fetchBoardWithTasks);
</script>
