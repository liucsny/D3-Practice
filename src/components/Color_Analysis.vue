<template>
  <div>
    <div class="mw8 center">
      <appColorPicker class="center mv4"></appColorPicker>
      <appColorAnalyzer class="center mv4"></appColorAnalyzer>
      <h2 class="fw4">Color Analysis</h2>
    </div>
  </div>
</template>

<script>
import appColorPicker from '@/components/color_picker';
import appColorAnalyzer from '@/components/color_analyzer';

export default {
  components: { appColorPicker, appColorAnalyzer }
}
</script>


<style>
</style>
