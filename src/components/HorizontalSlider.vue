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
      class="flex overflow-x-auto scroll-smooth snap-x snap-mandatory gap-7 no-scrollbar"
      style="scroll-behavior: smooth"
      @scroll="handleScroll"
    >
      <component
        :is="cardComponent"
        v-for="(item, index) in items"
        :key="index"
        :item="item"
      />
    </div>

    <button
      @click="scrollRight"
      class="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-0"
      
    >
      <i class="bx bx-chevron-right text-4xl text-[#525392]"></i>
    </button>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps<{
  items: Array<any>,
  cardComponent: any
}>()

const slider = ref<HTMLDivElement | null>(null)
const showLeftArrow = ref(false)
const showRightArrow = ref(false)

function handleScroll() {
  if (!slider.value) return

  const el = slider.value
   console.log('scrollLeft:', el.scrollLeft, 'clientWidth:', el.clientWidth, 'scrollWidth:', el.scrollWidth)
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
