<template>
  <div class="graph-dialog">
  <div class="graph-dialog-inner">
    <button @click="">
      Close
    </button>
  </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "GraphDialog",
  setup() {

    return {};
  }
};
</script>

<style scoped lang="scss">
.graph-dialog{
  position: fixed;
  top: 0;
  left:0;
  right:0;
  bottom:0;
  z-index: 99;
  background-color: rgba(0,0,0,0.2);

  display: flex;
  align-items: center;
  justify-content: center;

  .graph-dialog-inner{
    background-color: #FFF;
    padding: 32px;
  }

}
</style>
