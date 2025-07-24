<template>
  <div
    class="relative min-w-[149px] max-w-[200px] h-[180px] bg-[#f7f7f7] rounded-lg shadow-md text-[#525392] flex flex-col items-center justify-evenly text-center border border-[#525392] cursor-pointer hover:scale-[1.02] transition-transform"
    @click="goToBoard"
  >
    <div class="absolute top-2 left-22 right-2 gap-2 align-self-end" v-if="showActions">
      <button
        @click.stop="$emit('edit', item)"
        class="p-1 hover:text-[#353535]"
        title="Edit"
        aria-label="Edit"
        v-if="isAdmin"
      >
        <i class="bx bx-edit text-lg"></i>
      </button>

      <button
        @click.stop="$emit('delete', item)"
        class="p-1 hover:text-red-600"
        title="Delete"
        aria-label="Delete"
      >
        <i class="bx bx-trash text-lg"></i>
      </button>
    </div>

    <img
      src="../assets/purplecat.svg"
      alt="avatar"
      class="w-[100px] h-[100px] object-cover"
    />
    {{ item.title }}
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'

const router = useRouter()

defineProps<{
  item: {
    id: number
    title: string
  }
  showActions?: boolean
  isAdmin?: boolean
}>()

defineEmits(['edit', 'delete'])

function goToBoard() {
  router.push(`/board/${__props.item.id}`)
}
</script>
