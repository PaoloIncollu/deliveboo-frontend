<script>

    import HomeNavbar from './HomeNavbar.vue';

    export default {
        data() {
            return { 
            title: 'Quanto è buono DeliveBoo!',
            message: 'Vivi la ricchezza della vita attraverso ogni delizioso boccone, assapora il gusto che rende ogni momento davvero memorabile.',
            button: 'Fai un ordine',
            }
        },
        components: {
            HomeNavbar,
        },
    }

</script>

<template>

    <HomeNavbar />

    <div id="carousel-container">

        <div class="container-sm py-5">
            <div class="row align-items-center mt-5 text-white">

                <div class="col-md-6 col-sm-12 pb-3">

                    <h2 class="mb-0 fst-italic fw-lighter">
                        Quanto è buono
                    </h2>

                    <h1 class="mb-4 mt-0">
                        Delive<span class="text-warning">Boo</span>
                    </h1>

                    <h4 class="mb-5 fw-lighter">
                        {{ message }}
                    </h4>

                    <button class="btn btn-outline-warning rounded-pill px-4" type="submit">
                        <a class="nav-link" href="#main">
                            {{ button }}
                        </a>
                    </button>
                    
                </div>

            </div> 
        </div> 

        <img id="deliveboo" src="/deliveboo_bg.png" alt="deliveboo">

        <div id="carouselExample" class="carousel slide carousel-fade" data-bs-ride="carousel" data-bs-interval="4000">

            <div class="carousel-inner">

                <div class="carousel-item active">
                    <img src="/public/piatti/burger.jpg"
                    class="d-block w-100"
                    alt="hamburger">
                </div>

                <div class="carousel-item">
                    <img src="/public/piatti/pizza.jpg"
                    class="d-block w-100 rotate-y"
                    alt="pizza">
                </div>

                <div class="carousel-item">
                    <img src="/public/piatti/tacos.jpg"
                    class="d-block w-100"
                    alt="tacos">
                </div>

                <div class="carousel-item">
                    <img src="/public/piatti/fish.jpg"
                    class="d-block w-100 rotate-y"
                    alt="fish">
                </div>

                <div class="carousel-item">
                    <img src="/public/piatti/borscht.jpg"
                    class="d-block w-100 rotate-y"
                    alt="borscht">
                </div>

                <div class="carousel-item">
                    <img src="/public/piatti/cinnamo.jpg"
                    class="d-block w-100"
                    alt="cinnamo">
                </div>

                <div class="carousel-item">
                    <img src="/public/piatti/bruschetta.jpg"
                    class="d-block w-100"
                    alt="bruschetta">
                </div>

                <div class="carousel-item">
                    <img src="/public/piatti/sushi.jpg"
                    class="d-block w-100"
                    alt="sushi">
                </div>

            </div>

        </div>

    </div>

</template>

<style lang="scss" scoped>
    @use '../assets/scss/main.scss' as *;

    h1{
      font-size: 7rem;
      font-family: "Knewave", system-ui;
    }

    #carousel-container{
      max-width: 100%;
      position: relative;
      height: calc(100vh - 76px);
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgb(0,0,0);
        background: linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(250,250,251,0) 55%);
        z-index: -1;
      }

      & #deliveboo{
            position: absolute;
            z-index: -2;
            width: 100%;
            bottom: 0;
            left:0;
            object-fit: cover;
            object-position: center;
        }

      & #carouselExample{
        position: absolute;
        z-index: -3;
        top: 0;
        left:0;
        height: 100;
        width: 100%;

          .carousel-inner {
            height: 100%;
            display: flex;
            align-items: center;

            .carousel-item{
              height: 100%;

              img{
                height: 100vh;
                // max-height: 100%;
                width: 100%;
                object-fit: cover;
                object-position: center;
              }
        }
        .rotate-y{
            transform: rotateY(180deg)
        }
      }
    }

    @media screen and (max-width: 576px) {
        h1 {
            font-size: 4.5rem;
        }
    }
    }
</style>