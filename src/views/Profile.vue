<template>
  <div class="flex w-[78vw] items-start justify-between">
    <div class="p-6">
      <h2 class="text-3xl text-f7f7f7">Profile</h2>
      <p class="text-md text-f7f7f7 mt-2" style="font-weight: 300;">Manage your data</p>
    </div>
  </div>

  <div v-if="isLoading" class="p-6">
    <FullPageLoader />
  </div>

  <div v-else class="w-full flex justify-center items-center flex-col gap-6">
    <img
        src="../assets/profile.jpg"
        alt="avatar"
        class="w-[150px] h-[150px] rounded-full object-cover"
    />
    <div>
        <div class="flex flex-col">
            <p>Name: {{ user.name }}</p>
            <p>E-mail: {{ user.email }}</p>
        </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, computed } from 'vue'
import api from '../services/api'
import FullPageLoader from '../components/FullPageLoader.vue'
import { useAuthStore } from '../stores/auth'

interface User {
  id: string;
  name: string;
  email: string;
}

const auth = useAuthStore();
const user = computed(() => auth.user);

console.log(user.value)

const userIsAdmin = computed(() => user.value.is_admin == true);

const isLoading = ref(false)

const fetchBoards = async (page = 1) => {
  isLoading.value = true
  try {
    const response = await api.get('/api/boards', {
      params: { page }
    })
  } catch (err) {
    console.error('Error loading boards data', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchBoards()
})

</script>
