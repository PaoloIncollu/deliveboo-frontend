<script>
    import axios from 'axios';

    import HomeHeader from './HomeHeader.vue';
    
    export default {
        data() {
            return { 
                restaurants:[],
                typologies:[],
                selectedTypologies:[],
                currentSlideTypologies: 0,
                isChanging: false,
                selectAll:false,
                prevPage: null,
                nextPage: null,
                clickedButton: false,
                src: 'https://img.freepik.com/foto-gratuito/casseruola-deliziosa-su-un-supporto-di-legno_140725-949.jpg?t=st=1732115219~exp=1732118819~hmac=a770c4e44b39756dc35b8e695723d986b23128123c95a768703d5215ea5b9dfe&w=1380'
            }
        },
        components: {
            HomeHeader,
        },
        mounted(){
            this.getTypologies();
            this.getRestaurants();
        },
        methods: {
            getTypologies(){
                axios.get('http://127.0.0.1:8000/api/typologies')
                    .then(res => {
                        this.typologies = res.data.data.typologies;
                    });
            },
            getRestaurants() {
                axios
                    .get('http://127.0.0.1:8000/api/restaurants', {
                        params: {
                            typology_name: this.selectedTypologies.join(',')
                        }
                    })
                    .then(res => {
                        this.restaurants = res.data.data.restaurants.data;

                        this.restaurants.forEach(restaurant => {
                            if (restaurant.img) {
                                if (restaurant.img.startsWith('http') || restaurant.img.startsWith('https')) {
                                    restaurant.img = restaurant.img;
                                } else {
                                    restaurant.img = `http://127.0.0.1:8000/storage/${restaurant.img}`;
                                }
                            } else {
                                restaurant.img = this.src;
                            }
                        });

                        this.prevPage = res.data.data.restaurants.prev_page_url;
                        this.nextPage = res.data.data.restaurants.next_page_url;
                    });
            },
            clearSelectedTypologies() {
                this.selectedTypologies = []; 
                this.filterByTypology();    
            },
            prevSlide() {
                if (this.isChanging || this.currentSlideTypologies === 0) return; 
                    this.isChanging = true;

                    this.currentSlideTypologies--;
                
                setTimeout(() => {
                    this.isChanging = false; 
                }, 500); 
            },
            nextSlide() {
                if (this.isChanging || this.currentSlideTypologies === this.groupedTypologies.length - 1) return; 
                    this.isChanging = true;
                
                    this.currentSlideTypologies++;
                
                setTimeout(() => {
                this.isChanging = false;
                }, 500); 
            },
            filterByTypology() {
                this.getRestaurants();
            },
            toggleAllTypologies() {
                if (this.selectAll) {
                    this.selectedTypologies = this.typologies.map(t => t.typology_name);
                } else {
                    this.selectedTypologies = [];
                }
                this.filterByTypology();
            },
            ToPrevPage() {
                this.clickedButton = true;
                axios
                    .get(this.prevPage, {
                        params: {
                            typology_name: this.selectedTypologies.join(',')
                        }
                    })
                    .then(res => {
                        this.restaurants = res.data.data.restaurants.data;

                        this.restaurants.forEach(restaurant => {
                            if (restaurant.img) {
                                if (restaurant.img.startsWith('http') || restaurant.img.startsWith('https')) {
                                    restaurant.img = restaurant.img;
                                } else {
                                    restaurant.img = `http://127.0.0.1:8000/storage/${restaurant.img}`;
                                }
                            } else {
                                restaurant.img = this.src;
                            }
                        });

                        this.prevPage = res.data.data.restaurants.prev_page_url;
                        this.nextPage = res.data.data.restaurants.next_page_url;
                        this.clickedButton = false;
                    });
            },
            ToNextPage() {
                this.clickedButton = true;
                axios
                    .get(this.nextPage, {
                        params: {
                            typology_name: this.selectedTypologies.join(',')
                        }
                    })
                    .then(res => {
                        this.restaurants = res.data.data.restaurants.data;

                        this.restaurants.forEach(restaurant => {
                            if (restaurant.img) {
                                if (restaurant.img.startsWith('http') || restaurant.img.startsWith('https')) {
                                    restaurant.img = restaurant.img;
                                } else {
                                    restaurant.img = `http://127.0.0.1:8000/storage/${restaurant.img}`;
                                }
                            } else {
                                restaurant.img = this.src;
                            }
                        });

                        this.prevPage = res.data.data.restaurants.prev_page_url;
                        this.nextPage = res.data.data.restaurants.next_page_url;
                        this.clickedButton = false;
                    });
            }
        },
        watch: {
            selectedTypologies(newVal) {
                this.selectAll = newVal.length === this.typologies.length;
            }
        },
        computed: {
            groupedTypologies() {
                const groups = [];
                for (let i = 0; i < this.typologies.length; i += 5) {
                    groups.push(this.typologies.slice(i, i + 5));
                }
                return groups;
            }
        },
    }
</script>

<template>

    <HomeHeader />
  
    <main id="main" class="py-5">

        <div class="container-sm">

            <div class="mb-5">
                <h3>
                    Seleziona le <span class="text-warning">Tipologie</span> del Ristorante
                </h3>

                <div id="typologyCarousel" class="carousel slide d-flex align-items-center mb-4">
                    
                    <div class="w-25 text-end pt-3">
                        <button 
                            class="btn btn-outline-dark border-dark-subtle text-warning mx-2 rounded-pill" 
                            type="button" 
                            data-bs-target="#typologyCarousel" 
                            data-bs-slide="prev"
                            :disabled="currentSlideTypologies === 0 || isChanging"
                            @click="prevSlide"
                        >
                        <i class="fa-solid fa-chevron-left"></i>
                        </button>
                    </div>
                    
                    <div class="carousel-inner w-50">
                        <div 
                            v-for="(group, index) in groupedTypologies" 
                            :key="index" 
                            class="carousel-item" 
                            :class="{ active: index === currentSlideTypologies }"
                        >
                            <div class="d-flex flex-wrap justify-content-center">
                                <div 
                                    v-for="(typology, i) in group" 
                                    :key="i" 
                                    
                                >
                                    <div class="form-check pt-3">
                                        <input 
                                            class="btn-check" 
                                            type="checkbox" 
                                            :id="'typology-' + (index * 5 + i)" 
                                            :value="typology.typology_name" 
                                            v-model="selectedTypologies" 
                                            @change="filterByTypology" 
                                            
                                        />
                                        <label 
                                            class="btn rounded-pill py-0"
                                            :class="selectedTypologies.includes(typology.typology_name) ? 'bg-warning text-white border-none' : 'bg-white border-warning text-warning'"  
                                            :for="'typology-' + (index * 5 + i)"
                                        >
                                            {{ typology.typology_name }}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="w-25 text-start pt-3">
                        <button 
                            class="btn btn-outline-dark border-dark-subtle text-warning mx-2 rounded-pill" 
                            type="button" 
                            data-bs-target="#typologyCarousel" 
                            data-bs-slide="next"
                            :disabled="currentSlideTypologies === groupedTypologies.length - 1 || isChanging"
                            @click="nextSlide"
                        >
                            <i class="fa-solid fa-chevron-right"></i>
                        </button>
                    </div>
                    
                </div>

                <button 
                    class="btn btn-outline-dark border-dark-subtle text-warning rounded-pill" 
                    @click="clearSelectedTypologies"
                    v-if="selectedTypologies.length > 0"
                >
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>

            <div class="row" id="restaurants">

                <div class="col-sm-12 col-md-6 col-lg-3 mb-5 d-flex" v-for="restaurant in restaurants" :key="restaurant.id">

                    <div class="card rounded-top-5 p-2 align-self-stretch flex-grow-1 mx-0">
                        <img class="card-img-top rounded rounded-top-5" :src="restaurant.img" :alt="restaurant.restaurant_name">

                        <div class="card-body text-center">
                            <h6 class="card-title mb-3 fw-bold">{{ restaurant.restaurant_name }}</h6>

                            <div>
                                <span v-for="typology in restaurant.typologies" :key="typology.id" class="badge rounded-pill text-bg-warning mb-2 mx-1">
                                    {{ typology.typology_name }}
                                </span>
                            </div>
                        </div>

                        <div>
                            <router-link class="btn btn-outline-warning text-black rounded-pill mb-3 px-4" :to="{ name: 'restaurant-show', params: { slug: restaurant.slug }}">
                                Menu
                            </router-link>
                        </div>

                    </div>

                </div>

            </div>

            <div>
                <div class="d-flex justify-content-center" v-if="restaurants && restaurants.length > 0">
                    <div >
                        <button @click="ToPrevPage()"
                            :disabled="prevPage == null || clickedButton"
                            class="btn btn-outline-dark border-dark-subtle text-warning mx-2 rounded-pill"
                            type="button"><i class="fa-solid fa-chevron-left"></i>
                        </button>
                    </div>
                    <div>
                        <button @click="ToNextPage()"
                            :disabled="nextPage == null || clickedButton"
                            class="btn btn-outline-dark border-dark-subtle text-warning mx-2 rounded-pill"
                            type="button"><i class="fa-solid fa-chevron-right"></i>
                        </button>
                    </div>
                </div>

                <div v-else class="mt-4">
                    <h3 class="text-center">Non ci sono
                        <span class="text-warning">Ristoranti</span>  disponibili con le 
                        <span class="text-warning">Tipologie</span> selezionate
                    </h3>
                </div>
            </div>

        </div>
        
    </main>
    
</template>

<style lang="scss" scoped>
  @use '../assets/scss/main.scss' as *;
  @import "bootstrap/scss/bootstrap";

  .card{
    box-shadow: 0 0 5px rgba(14, 14, 14, 0.2); 
    transition: box-shadow .3s;
    & img{
      height: 150px;
      object-fit: cover;
    }
  }
  .card:hover{
    border: 1px solid rgb(255, 206, 30);
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.503); 
  }
</style>