<template>
  <div class="flex w-[78vw] items-start justify-between">
    <div class="p-6 mb-7">
      <h2 class="text-3xl text-f7f7f7">Boards</h2>
      <p class="text-md text-f7f7f7 mt-2" style="font-weight: 300;">Manage your boards</p>
    </div>
    <SearchInput v-model="search" placeholder="Search..." />
  </div>

  <div v-if="isLoading" class="p-6">
    <FullPageLoader />
  </div>

  <div v-else class="p-6">
    <div v-if="isSearching">
      <h2 class="text-2xl text-f7f7f7 mb-7">Search Results</h2>
      <div v-if="searchResults.length">
        <div class="flex flex-wrap gap-7">
          <BoardCard
            v-for="board in searchResults"
            :key="board.id"
            :item="board"
            @click="openModal(board)"
          />
        </div>
      </div>
      <div v-else class="text-center text-f7f7f7 mt-6">
        Not found.
      </div>
    </div>

    <div v-else>
      <div v-if="boards.length">
        <div class="flex flex-wrap gap-3">
          <BoardCard
            v-for="board in boards"
            :key="board.id"
            :item="board"
            @click="openModal(board)"
          />
        </div>
      </div>
      <div v-else class="text-center text-f7f7f7 mt-6">
        Not found.
      </div>
    </div>
  </div>

  <BoardDetailsModal
    v-if="selectedBoard"
    :visible="showModal"
    :board="selectedBoard"
    @close="closeModal"
  />
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import api from '../services/api'
import HorizontalSlider from '../components/HorizontalSlider.vue'
import BoardCard from '../components/BoardCard.vue'
import SearchInput from '../components/SearchInput.vue'
import FullPageLoader from '../components/FullPageLoader.vue'
import BoardDetailsModal from '../components/BoardDetailsModal.vue'

const boards = ref([])
const reminders = ref([])

const search = ref('')
const isSearching = ref(false)
const isLoading = ref(false)
const searchResults = ref([])

const selectedBoard = ref(null)
const showModal = ref(false)

const openModal = (board: any) => {
  selectedBoard.value = board
  showModal.value = true
}
const closeModal = () => {
  showModal.value = false
  selectedBoard.value = null
}

onMounted(async () => {
  isLoading.value = true

  try {
    const [boardsRes] = await Promise.all([
      api.get('/api/boards'),
    ])

    boards.value = boardsRes.data.data
  } catch (err) {
    console.error('Error loading dashboard data', err)
  } finally {
    isLoading.value = false 
  }
})

watch(search, async (value) => {
  if (!value) {
    isSearching.value = false
    return
  }

  isSearching.value = true
  isLoading.value = true

  try {
    const res = await api.get('/api/boards', {
      params: { search: value }
    })
    searchResults.value = res.data.data || []
  } catch (err) {
    console.error('Error during search', err)
    searchResults.value = []
  } finally {
    isLoading.value = false
  }
})
</script>
