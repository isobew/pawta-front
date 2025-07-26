<template>
  <div class="w-[80vw] min-h-screen">
    <div class="flex flex-col md:flex-row justify-between items-center mb-10 gap-5 p-6 mb-2">
      <h2 class="text-3xl text-f7f7f7">{{ board?.title ? board.title : 'Loading...' }}</h2>
      <div class="flex justify-end items-center md:pr-12" v-if="userIsAdmin">
        <button id="auth-btn"
            v-if="tasks != null"
            @click="showCreateModal = true"
            class="min-h-[2.5em] min-w-[50px] text-dark font-bold text-lg rounded-full cursor-pointer">
            + Create task</button>
      </div>
    </div>

    <div v-if="tasks == null">
      <FullPageLoader />
    </div>

    <div v-if="tasks != null" class="ml-6 w-[93%] flex md:flex-row flex-col md:gap-0 gap-3 justify-between">
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
    <BoardTaskEditModal
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

    <BoardTaskCreateModal
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
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import api from '../services/api';

import Column from '../components/Column.vue';
import TaskDeleteModal from '../components/Task/TaskDeleteModal.vue';
import BoardTaskEditModal from '../components/BoardTask/BoardTaskEditModal.vue';
import TaskDetailsModal from '../components/Task/TaskDetailsModal.vue';
import BoardTaskCreateModal from '../components/BoardTask/BoardTaskCreateModal.vue';
import FullPageLoader from '../components/FullPageLoader.vue';

import { useAuthStore } from '../stores/auth';

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  creator_id: string;
  createdAt: string;
  due_date: string;
  assignee_id?: string;
  due_in: number;
}

interface Board {
  id: string;
  title: string;
  description: string;
}

const auth = useAuthStore();
const user = computed(() => auth.user);

const userIsAdmin = computed(() => user.value.is_admin == true);

const route = useRoute();
const board = ref<Board | null>(null);
const tasks = ref<Task[]>(null);

const selectedTaskToEdit = ref(null)
const showEditModal = ref(false)

const selectedTaskToDelete = ref(null)
const showDeleteModal = ref(false)

const showCreateModal = ref(false)

const showModal = ref(false)
const selectedTask = ref(null)

const openModal = (task: Task) => {
  selectedTask.value = task
  showModal.value = true
}
const closeModal = () => {
  showModal.value = false
  selectedTask.value = null
}

const openEditModal = (task: Task) => {
  selectedTaskToEdit.value = task
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  selectedTaskToEdit.value = null
}

const openDeleteModal = (task: Task) => {
  selectedTaskToDelete.value = task
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  selectedTaskToDelete.value = null
}

const fetchBoardWithTasks = async () => {
  try {
    const boardId = route.params.id;
    const res = await api.get(`/api/board/${boardId}`);
    board.value = res.data.board;
    tasks.value = res.data.tasks || [];
  } catch (error) {
    console.error('Error loading data:', error);
  }
};

const updateTaskStatus = async (id: string, status: string) => {
  try {
    await api.put(`/api/update-task/${id}`, { status });
    await fetchBoardWithTasks();
  } catch (error: any) {
    console.error('Error updating task', error);
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
      console.error('Erro deleting task', error);
    }
  }
};

onMounted(fetchBoardWithTasks);

const handleTaskCreated = () => {
  fetchBoardWithTasks();
  showCreateModal.value = false;
};

const handleTaskUpdated = () => {
  fetchBoardWithTasks();
  showEditModal.value = false;
};

const handleTaskDeleted = () => {
  fetchBoardWithTasks();
  showDeleteModal.value = false;
};
</script>
