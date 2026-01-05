<template lang="pug">
.fieldFreeTextEditor
    StoryblokRichText(:doc="blok.originalblok.text")
</template>

<script setup>
defineProps(['blok'])
</script>
