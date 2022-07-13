<script setup lang="ts">
import { GamePlay, isDev, toggleDev } from '~/composables'

const play = new GamePlay(12, 12)

useStorage('vuesweeper', play.state)

const state = computed(() => play.board)
</script>

<template>
  <div>
    minesweeper

    <div p5>
      <div v-for="(row, y) in state" :key="y" flex="~" justify-center items-center>
        <MineBlock
          v-for="(block, x) in row"
          :key="x"
          :block="block"
          @click="play.onClick($event, block)"
          @contextmenu.prevent="play.onRightClick(block)"
        />
      </div>
    </div>

    <div flex="~ gap-1" justify-center>
      <button btn @click="toggleDev()">
        {{ isDev ? "CHEAT" : "NORMAL" }}
      </button>
      <button btn @click="play.reset()">
        RESET
      </button>
    </div>
  </div>
</template>
