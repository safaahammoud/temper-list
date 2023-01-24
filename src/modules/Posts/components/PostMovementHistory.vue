<template>
  <h1 class="mb-10">
    {{ title }}
  </h1>

  <div
    v-for="(action, index) in actionsList"
    :key="action.id"
    class="flex flex-wrap justify-between px-6 py-4 rounded overflow-hidden shadow-lg mb-6"
  >
    <span class="w-full md:w-5/6 pr-3 mb-3">
      {{ cardTitle(action) }}
    </span>

    <button
      class="time-travel-button w-full md:w-1/6 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      @click="$emit('time-travel-btn-click', index)"
    >
      Time travel
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import { Direction } from '@/enums/Direction.enum';

import { PostMovementAction } from '../types/post.type';

export default defineComponent({
  name: 'PostMovementHistory',

  data: () => ({
    Direction,
  }),

  emits: ['time-travel-btn-click'],

  props: {
    actionsList: {
      type: Array as PropType<PostMovementAction[]>,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },

  methods: {
    cardTitle({ postDetails, oldIndex, newIndex }: PostMovementAction): string {
      return `Moved Element of title ${postDetails.title} from ${oldIndex} to ${newIndex}`;
    },
  },
});
</script>
