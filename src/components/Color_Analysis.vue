<template>
  <div>
    <div class="mw8 center">
      <appColorPicker class="center mv4"></appColorPicker>
      <appColorAnalyzer class="center mv4"></appColorAnalyzer>
      <!-- <appDynamicBinding></appDynamicBinding> -->
      <h2 class="fw4">Color Analysis</h2>
    </div>
  </div>
</template>

<script>
import appColorPicker from '@/components/color_picker';
import appColorAnalyzer from '@/components/color_analyzer';
import appDynamicBinding from '@/components/dynamic_binding.vue';

export default {
  components: { appColorPicker, appColorAnalyzer, appDynamicBinding }
}
</script>


<style>
</style>
