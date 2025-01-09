<script>

  import { store } from '../store.js';

  export default {
    data() {
      return { 
        store
      }
    }
  }
</script>

<template>

    <div class="bg-dark">
        <footer class="container-sm py-5">
            <div class="d-flex justify-content-between">

                <ul v-for="(link,i) in store.footerLinks" :key="i">

                    <h3 class="text-white">
                        {{ link.title }}
                    </h3>

                    <li v-for="(item,i) in link.links" :key="i" class="list-group-item">
                        <a href="#">
                            {{ item.nameLink }}
                        </a>
                    </li>

                </ul>
                
            </div>
        </footer>
    </div>
  
</template>

<style lang="scss" scoped>
    @use '../assets/scss/partials/variables' as *;

    .container-sm {
    div {
        ul {
        li {
            a {
            text-decoration: none;
            color: rgb(255, 206, 30);
            }
        }
        }
    }
    }

</style>