<template>
    <div class="uk-margin-top">
      <input :placeholder="placeholder" class="uk-width-1-1" v-model="model" />
    </div>
</template>

<script>
export default {
    props : [
        'model',
        'placeholder'
    ]
}
</script>

<style>

</style>