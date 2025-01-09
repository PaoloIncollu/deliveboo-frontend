<script>

    import HomeMain from './components/Homepage/HomeMain.vue';
    import HomeFooter from './pages/HomeFooter.vue';

    export default {
        data() {
            return { 

            }
        },

        components: {
            HomeMain,
            HomeFooter
        },
        methods: {

        }
    }

</script>

<template>

    <div>
        <HomeMain />
        <HomeFooter />
    </div>

</template>

<style lang="scss">
    @use 'assets/scss/main' as *;
    @import "bootstrap/scss/bootstrap";
</style>
