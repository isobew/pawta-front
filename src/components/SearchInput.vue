<template>
  <div class="relative md:w-[30%] w-full max-w-md md:ml-0 ml-6 mr-4 md:mt-9 md:mb-0 mb-5">
    <input
      v-model="searchQuery"
      type="text"
      :placeholder="placeholder"
      class="w-full pl-10 pr-4 py-2 border border-[#525392] rounded-full bg-[#f7f7f7] text-[#353535] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#525392]"
    />
    <i class="bx bx-search absolute left-3 top-5 transform -translate-y-1/2 text-[#525392] text-lg"></i>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'

const props = defineProps<{
  modelValue: string
  placeholder?: string
}>()

const emit = defineEmits(['update:modelValue'])

const searchQuery = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
  searchQuery.value = val
})

watch(searchQuery, (val) => {
  emit('update:modelValue', val)
})
</script>
