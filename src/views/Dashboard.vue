<template>
  <div class="p-6 space-y-10">
    <h1 class="text-2xl font-bold text-f7f7f7">Tasks</h1>
    <HorizontalSlider :items="tasks" />

    <h1 class="text-2xl font-bold text-f7f7f7">Reminders</h1>
    <HorizontalSlider :items="reminders" />

    <h1 class="text-2xl font-bold text-f7f7f7">Boards</h1>
    <HorizontalSlider :items="boards" />

  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'
import HorizontalSlider from '../components/HorizontalSlider.vue' 

const tasks = ref([])
const boards = ref([])
const reminders = ref([])

onMounted(async () => {
  try {
    const [tasksRes, boardsRes, remindersRes] = await Promise.all([
      api.get('/api/tasks'),
      api.get('/api/boards'),
      api.get('/api/reminders')
    ])

    tasks.value = tasksRes.data.data
    boards.value = boardsRes.data.data
    reminders.value = remindersRes.data
    
  } catch (err) {
    console.error('Erro ao carregar dados da dashboard', err)
  }
})
</script>
