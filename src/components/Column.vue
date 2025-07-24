<script setup lang="ts">
import { computed } from 'vue'
import draggable from 'vuedraggable'
import BoardTaskCard from './BoardTaskCard.vue'

interface Task {
  id: number;
  title: string;
  status: 'to-do' | 'in-progress' | 'done';
  board_name?: string;
  due_in?: number;
  board_id: number;
  assignee_id: number;
}

const props = defineProps<{
  title: string
  status: string
  tasks: Task[]
  showActions?: boolean
  isAdmin?: boolean
}>()

const emit = defineEmits(['taskMoved', 'edit', 'delete', 'select'])

const filteredTasks = computed({
  get() {
    return props.tasks.filter((t) => t.status === props.status)
  },
  set(newTasks) {
    newTasks.forEach((task: Task) => {
      if (task.status !== props.status) {
        task.status = props.status
        emit('taskMoved', { id: task.id, status: props.status })
      }
    })
  }
})
</script>

<template>
  <div class="column-container p-4 rounded h-full w-70 overflow-y-auto">
    <h2 class="font-semibold mb-9 text-[#f7f7f7]">{{ title }}</h2>
    
    <draggable
      v-model="filteredTasks"
      group="tasks"
      item-key="id"
      class="space-y-2 min-h-[100px]"
    >
      <template #item="{ element }">
        <BoardTaskCard
          :item="element"
          :showActions="props.showActions"
          :isAdmin="props.isAdmin"
          @edit="emit('edit', element)"
          @delete="emit('delete', element)"
          @select="emit('select', element)"
        />
      </template>
    </draggable>
  </div>
</template>
