import { createRouter, createWebHistory } from 'vue-router';
// createWebHistory = simula una cronologia di navigazione.
import RestaurantsPage from './pages/RestaurantsPage.vue';
import NotFoundPage from './pages/NotFoundpage.vue'
import SingleRestaurantPage from './pages/SingleRestaurantPage.vue'
import Checkout from './pages/Checkout.vue'


const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'restaurants',
            component: RestaurantsPage
        },
        {
            path: '/restaurant/:slug',
            name: 'restaurant-show',
            component: SingleRestaurantPage
        },
        {
            path: '/checkout/:slug',
            name: 'checkout',
            component: Checkout
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'not-found',
            component: NotFoundPage
        }
    ]
});

export { router };