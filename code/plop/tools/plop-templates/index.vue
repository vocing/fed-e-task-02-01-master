<template>
  <article calss="component">
  </article>
</template>
<script>
export default {
  name: 'v-{{ kebabCase name }}',
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>
<style lang="stylus" scoped>
@import "./styl"
</style>
