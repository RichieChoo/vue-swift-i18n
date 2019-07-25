<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">{{test}}</router-link>|
      <router-link to="/about" :title="测试">测试</router-link>
    </div>t
    <router-view />
  </div>
</template>
<script>
export default {
    data() {
        return {
            test: '测试',
        };
    },
};
</script>

<style lang="less">
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}
#nav {
    padding: 30px;
    a {
        font-weight: bold;
        color: #2c3e50;
        &.router-link-exact-active {
            color: #42b983;
        }
    }
}
</style>
