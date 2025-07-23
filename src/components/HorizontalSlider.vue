<template>
  <div class="relative">
    <button
      @click="scrollLeft"
      class="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-0"
      v-if="showLeftArrow"
    >
      <i class="bx bx-chevron-left text-4xl text-[#525392]"></i>
    </button>

    <!-- Slider -->
    <div
      ref="slider"
      class="flex overflow-x-auto scroll-smooth snap-x snap-mandatory gap-4 no-scrollbar px-10"
      style="scroll-behavior: smooth"
      @scroll="handleScroll"
    >
      <div
        v-for="(item, index) in items"
        :key="index"
        class="min-w-[200px] max-w-[200px] h-[120px] bg-[#2f2f2f] rounded-xl shadow-md text-f7f7f7 flex items-center justify-center text-center"
      >
        {{ item.title }}
      </div>
    </div>

    <button
      @click="scrollRight"
      class="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-0"
      v-if="showRightArrow"
    >
      <i class="bx bx-chevron-right text-4xl text-[#525392]"></i>
    </button>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps<{ items: Array<{ title: string }> }>()

const slider = ref<HTMLDivElement | null>(null)
const showLeftArrow = ref(false)
const showRightArrow = ref(false)

function handleScroll() {
  if (!slider.value) return

  const el = slider.value
  showLeftArrow.value = el.scrollLeft > 10
  showRightArrow.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 10
}

function scrollLeft() {
  slider.value?.scrollBy({ left: -220, behavior: 'smooth' })
  setTimeout(handleScroll, 300)
}

function scrollRight() {
  slider.value?.scrollBy({ left: 220, behavior: 'smooth' })
  setTimeout(handleScroll, 300)
}

onMounted(() => {
  handleScroll()
})

watch(() => props.items.length, () => {
  handleScroll()
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
