<script setup lang="ts">
import type { BlockState } from '~/types'
import { isDev } from '~/composables'

defineProps<{ block: BlockState }>()

const numberColors = [
  'text-transparent',
  'text-blue-500',
  'text-gray-500',
  'text-yellow-500',
  'text-green-500',
  'text-pink-500',
  'text-emerald-500',
  'text-indigo-500',
  'text-cyan-500',
]

function getBlockClass(block: BlockState) {
  if (block.figged)
    return 'bg-gray-500/10 '
  if (!block.revealed)
    return 'bg-gray-500/10 hover:bg-gray-500/20'

  return block.mine ? 'bg-red-500/50' : numberColors[block.adjacentMines]
}
</script>

<template>
  <button
    flex="~"
    justify-center items-center
    w-10 h-10
    m="0.5"
    border="1 gray-400/10"
    :class="getBlockClass(block)"
  >
    <template v-if="block.figged">
      <div i-mdi:flag text-red />
    </template>
    <template v-else-if="block.revealed || isDev">
      <div v-if="block.mine" i-mdi:mine />
      <div v-else>
        {{ block.adjacentMines }}
      </div>
    </template>
  </button>
</template>
