<template>
  <div className='flex flex-col justify-center items-center h-full gap-2'>
    <div className='text-3xl font-bold text-green-400'>{{count}}</div>
    <div>If my count is 3 or more I will throw an error</div>
    <button className='bg-gray-900 py-2 px-4 rounded-full text-white' @click="increment">
      Increment
    </button>
  </div>
</template>

<script setup>
import './index.scss'
import { ref } from 'vue'

const count = ref(0)

const increment = () => {
  count.value++
  if (count.value >= 3) {
    throw new Error('Count is too high')
  }
}


</script>
