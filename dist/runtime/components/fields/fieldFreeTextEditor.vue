<template lang="pug">
.fieldFreeTextEditor
    StoryblokRichText(:document="blok.originalblok.text")
</template>

<script setup>
defineProps(["blok"]);
</script>
