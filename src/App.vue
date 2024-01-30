<template>

  <div>
    <v-menu>
      <template v-slot:activator="{ props }">
        <v-btn class="main-menu-btn" icon="mdi-menu" v-bind="props"></v-btn>
      </template>

      <v-list>
        <v-list-item
            v-for="(item, i) in items"
            :key="i"
            :to="item.to"
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>

  <div>
    <Suspense>
      <router-view></router-view>
    </Suspense>
  </div>
</template>

<script lang="ts">
import {ref} from 'vue';

export default {
  name: "AppDisplay",
  setup() {

    const items = ref([
      {title: 'Graph', to: '/graph'},
      {title: 'Click Me', to: '/'},
      {title: 'Click Me', to: '/'},
      {title: 'Click Me 2', to: '/'},
    ]);

    return {
      items
    };

  }
};

</script>


<style scoped lang="scss">>
div {
  height: 100%;
}

.main-menu-btn {
  display: block;
  position: fixed;
  z-index: 99;
}

</style>
