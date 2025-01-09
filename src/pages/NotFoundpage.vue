<script>

    import HomeNavbar from './HomeNavbar.vue';

    export default {

        components: {
            HomeNavbar,
        },
    }

</script>

<template>

    <HomeNavbar />

    <div id="notfound" class="d-flex align-items-center justify-content-center">
        <h1 class="text-center">
            <div class="text-warning d-flex align-items-center justify-content-center mb-3">
                4<span>
                <img class="mx-1" src="/public/DeliveBoo.png" alt="deliveboo">
                </span>4
            </div>
            Not found :(
        </h1>
    </div>

</template>

<style>

    #notfound{
        min-height: calc(100vh - 325px);
        background-color: rgb(255, 246, 235);
    }
    h1{
        font-size: 4rem;
        font-family: "Knewave", system-ui;
    }
    img{
        width: 70px;
    }

</style>