<template lang="pug">
.fieldCustomFunction
    StoryblokComponent(:blok="{...blok.originalblok,component:blok.originalblok.componentName}")
</template>

<script setup>
defineProps(["blok"]);
</script>
