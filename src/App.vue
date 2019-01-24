<template>
  <div id="app">
    <nav>
      <router-link to="/">
        <img src="./assets/img/logo.png"  />
      </router-link>
    </nav>
    <router-view/>
  </div>
</template>

<style lang="scss">
nav img {
  width: 100px;
}
</style>
