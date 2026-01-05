<template lang="pug">
button.submit.BodyCTA(type="submit" :class="field.class")
    span.label(v-html="field.label")
</template>

<script setup>
const { field } = defineProps(['field'])
</script>

<style lang="scss">
.submit{
    cursor: pointer;
    background: $brownDark;
    color: $white;
    text-decoration: none;
    padding: 1rem 3rem;
    box-sizing: border-box;
    border-radius: 1rem;
    white-space: nowrap;
    border: 0;
	font-family: "Kantumruy Pro", sans-serif;
}
</style>
