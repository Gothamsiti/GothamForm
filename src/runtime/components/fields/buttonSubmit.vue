<template lang="pug">
button.submit.BodyCTA(type="submit" :class="field.class")
    span.label(v-html="field.label")
</template>

<script setup>
defineProps(['field'])
</script>
