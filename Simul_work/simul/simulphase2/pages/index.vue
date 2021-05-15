<template>
  <div class="banner">
    <div class="banner-text">
      <img alt="Simul logo" src="../static/logo3.png" width="70%" />
    </div>
  </div>
</template>

<style scoped>
.banner {
  background-image: url("../static/banner2.jpg");
  background-position: center; /* Center the image */
  background-repeat: no-repeat; /* Do not repeat the image */
  background-size: cover; /* Resize the background image to cover the entire container */
  height: 800px;
  width: 100%;
}

.banner-text {
  padding-top: 40px;
  margin-left: 5%;
  text-align: left;
  width: 40%;
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
