<template>
  <div class="flex w-[78vw] items-start justify-between">
    <div class="p-6 mb-2">
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
            @edit="openEditModal"
            @delete="openDeleteModal"
            :showActions="true"  
            :isAdmin="userIsAdmin"
          />
        </div>
      </div>
      <div v-else class="text-center text-f7f7f7 mt-6">
        Not found.
      </div>
    </div>

    <div v-else>
      <div class="flex w-[78vw] justify-end pr-12" v-if="userIsAdmin">
        <button id="auth-btn"
            @click="showCreateModal = true"
            class="min-h-[2.5em] min-w-[50px] text-dark font-bold text-lg rounded-full cursor-pointer mb-8">
            + Create board</button>
      </div>
      <div v-if="boards.length">
        <div class="flex flex-wrap gap-4">
          <BoardCard
            v-for="board in boards"
            :key="board.id"
            :item="board"
            @edit="openEditModal"
            @delete="openDeleteModal"
            :showActions="true"  
            :isAdmin="userIsAdmin"
          />
        </div>
      </div>
      <div v-else class="text-center text-f7f7f7 mt-6">
        Not found.
      </div>
    </div>
  </div>

  <!-- Modais -->
  <BoardEditModal
    v-if="selectedBoardToEdit"
    :visible="showEditModal"
    :board="selectedBoardToEdit"
    @close="closeEditModal"
    @updated="handleBoardUpdated"
  />

  <BoardDeleteModal
    v-if="selectedBoardToDelete"
    :visible="showDeleteModal"
    :board="selectedBoardToDelete"
    @close="closeDeleteModal"
    @deleted="handleBoardDeleted"
  />

  <BoardCreateModal
    :visible="showCreateModal"
    @close="showCreateModal = false"
    @created="handleBoardCreated"
  />
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, computed } from 'vue'
import api from '../services/api'
import BoardCard from '../components/BoardCard.vue'
import SearchInput from '../components/SearchInput.vue'
import FullPageLoader from '../components/FullPageLoader.vue'
import BoardEditModal from '../components/BoardEditModal.vue'
import BoardDeleteModal from '../components/BoardDeleteModal.vue'
import BoardCreateModal from '../components/BoardCreateModal.vue'
import { useAuthStore } from '../stores/auth'

interface Board {
  id: string;
  title: string;
}

const auth = useAuthStore();
const user = computed(() => auth.user);

const userIsAdmin = computed(() => user.value.is_admin == true);

const boards = ref([])
const search = ref('')
const isSearching = ref(false)
const isLoading = ref(false)
const searchResults = ref([])

const selectedBoardToEdit = ref(null)
const showEditModal = ref(false)

const selectedBoardToDelete = ref(null)
const showDeleteModal = ref(false)

const showCreateModal = ref(false)

const openEditModal = (board: Board) => {
  selectedBoardToEdit.value = board
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  selectedBoardToEdit.value = null
}

const openDeleteModal = (board: Board) => {
  selectedBoardToDelete.value = board
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  selectedBoardToDelete.value = null
}

const handleBoardUpdated = (updatedBoard: Board) => {
  const index = boards.value.findIndex(b => b.id === updatedBoard.id)
  if (index !== -1) {
    boards.value[index] = updatedBoard
  }
  if (isSearching.value) {
    const searchIndex = searchResults.value.findIndex(b => b.id === updatedBoard.id)
    if (searchIndex !== -1) {
      searchResults.value[searchIndex] = updatedBoard
    }
  }
  closeEditModal()
}

const handleBoardDeleted = (deletedBoardId: number) => {
  boards.value = boards.value.filter(b => b.id !== deletedBoardId)
  if (isSearching.value) {
    searchResults.value = searchResults.value.filter(b => b.id !== deletedBoardId)
  }
  closeDeleteModal()
}

const handleBoardCreated = (newBoard: Board) => {
  boards.value.unshift(newBoard)
  if (isSearching.value && search.value) {
    searchResults.value.unshift(newBoard)
  }
  showCreateModal.value = false
}

onMounted(async () => {
  isLoading.value = true
  try {
    const boardsRes = await api.get('/api/boards')
    boards.value = boardsRes.data.data
  } catch (err) {
    console.error('Error loading boards data', err)
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
