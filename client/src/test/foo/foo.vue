<script setup>
import { ref } from 'vue'

const count = ref(0)

function increment() {
  count.value++
}

count.value = 10

defineExpose({
  increment,
 
})


</script>

<template>
  <button @click="increment">Count is: {{ count }}</button>
</template>