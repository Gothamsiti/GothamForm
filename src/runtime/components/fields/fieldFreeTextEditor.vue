<template lang="pug">
.fieldFreeTextEditor
	StoryblokRichText(:doc="blok.originalblok.text")
</template>

<script setup>
const { blok } = defineProps(['blok'])
</script>

<style lang="scss">
.fieldFreeTextEditor{

}
</style>
