<script>

    import axios from 'axios';

    import dropin from 'braintree-web-drop-in';

    import { Modal } from 'bootstrap';

    export default {
    data() {
        return {
        defaultUrl: 'http://127.0.0.1:8000/api/orders',
        cart: [],
        loading: false,
        dropinInstance: null,
        newOrder: {
            customer_email: '',
            customer_name: '',
            customer_address: '',
            customer_number: '',
            total_price: 0,  
        },
        message: '',
        error: '',
        };
    },
    computed: {
        cartTotal() {
        return this.cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
        },
    },
    mounted() {
        this.loadCart(); 
        this.initializeDropin(); 
        this.verifyRestaurant();
    },
    methods: {
        async verifyRestaurant() {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/restaurants/${this.$route.params.slug}`);
                if (!response.data.success) {
                    this.$router.push({ name: 'not-found' }); 
                }
            } catch (error) {
                console.error('Errore durante la verifica del ristorante:', error);
                this.$router.push({ name: 'not-found' }); 
            }
        },
        goBack() {
            this.$router.back();
        },
        async initializeDropin() {
            try {
                const response = await axios.get('http://localhost:8000/api/braintree/token');
                const clientToken = response.data.clientToken;

                this.dropinInstance = await dropin.create({
                authorization: clientToken,
                container: '#dropin-container',
                });
            } catch (error) {
                console.error('Errore nella creazione del drop-in:', error);
            }
            },
            async submitPayment() {
        if (!this.dropinInstance) {
        this.error = 'Drop-in non inizializzato!';
        this.showErrorModal();
        return;
        }

        this.loading = true;

        try {
        const payload = await this.dropinInstance.requestPaymentMethod();
        await axios.post('http://localhost:8000/api/braintree/checkout', {
            nonce: payload.nonce,
            amount: this.cartTotal
        },
        this.sendOrder()
        );
        /* this.message = 'Pagamento effettuato con successo!';
        this.error = ''; */
        } catch (error) {
        console.error('Errore durante il pagamento:', error);
        this.error = 'Errore durante il pagamento. Riprova.';
        this.showErrorModal();
        } finally {
        this.loading = false;
        }
    },
    showErrorModal() {
        const modal = new Modal(document.getElementById('errorModal'));
        modal.show();
    },
        loadCart() {
        const cartItems = JSON.parse(localStorage.getItem(`cart_${this.$route.params.slug}`));
        
        if (cartItems && cartItems.length > 0) {
            this.cart = cartItems;
            this.newOrder.total_price = this.cartTotal; 
        } else {
            this.error = 'Il carrello è vuoto. Non puoi procedere con l\'ordine.';
        }
        },
        sendOrder() {
        if (!this.cart.length) {
            this.error = 'Il carrello è vuoto.';
            return;
        }

        const orderData = {
            items: this.cart,
            total_price: this.cartTotal, 
            restaurant_slug: this.$route.params.slug,
            customer: { 
                email: this.newOrder.customer_email,
                name: this.newOrder.customer_name,
                address: this.newOrder.customer_address,
                number: this.newOrder.customer_number,
            },
        };

            console.log("Sending Order Data:", orderData);

        axios
            .post(this.defaultUrl, orderData)
            .then((res) => {
            this.message = 'Ordine inviato con successo!';
            this.error = '';

            localStorage.removeItem(`cart_${this.$route.params.slug}`);

            this.newOrder = {
                customer_email: '',
                customer_name: '',
                customer_address: '',
                customer_number: '',
                total_price: 0,
            };
            this.cart = []; 
            })
            .catch((err) => {
            console.log(err.response); 
            this.error = err.response?.data?.message || 'Errore durante l\'invio dell\'ordine. Controlla i dati e riprova.';
            this.message = '';
            });
        },
    },
    };

</script>

<template>
    <div class="container-sm">
        <nav class="navbar navbar-expand-lg my-1">
            <div class="collapse navbar-collapse d-flex justify-content-between">

                <router-link class="navbar-brand d-flex align-items-center" to="/">
                    <img class="logo me-2" src="/public/DeliveBoo.png" alt="Deliveboo">
                    Delive<strong class="text-warning">Boo</strong>
                </router-link>

            </div>
        </nav>
    </div>

    <div id="checkout" class="py-5">
        <div class="container-sm">

        <div v-if="message" id="message-confirm" class="container text-center">

            <h1 class="mb-4">
                Ordine <span class="text-warning">Confermato!</span>
            </h1>

            <div id="gif-container" class="mb-4">
                <div>
                    <img src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/i/ec787be8-371a-4698-8c42-4d6e8d7486ca/d7zqbfa-0f1e6646-a7a3-412f-965a-b1361f95f89c.gif" alt="driver">
                </div>
                <div id="grass">
                    <img src="https://cdn.vectorstock.com/i/500p/15/74/pixel-art-grass-icon-retro-pixelated-green-vector-54061574.jpg" alt="grass">
                </div>
            </div>
            
            <div class="mb-4 fs-3 fw-bold">
                Grazie per averci scelto!
            </div>

            <div class="fs-5">
                Il tuo ordine è in preparazione, <br> ti avviseremo quando il rider avrà ritirato l'ordine dal ristorante.
            </div>

            <button class="btn btn-outline-dark border-dark rounded-pill text-warning px-4 mt-5 fs-5">
                <router-link class="navbar-brand d-flex align-items-center" to="/">
                    Torna alla Home
                </router-link>
            </button>

        </div>
        
        <div class="modal fade" id="errorModal" tabindex="-1" aria-labelledby="errorModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">

                    <div class="modal-header">
                        <h5 class="modal-title" id="errorModalLabel">Errore</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>

                    <div class="modal-body">
                        {{ error }}
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Chiudi</button>
                    </div>

                </div>
            </div>
        </div>

        <form @submit.prevent="submitPayment" v-if="cart.length > 0">

            <div class="row">

                <div class="col-12 col-lg-7 mb-4 mb-lg-0">
                    <div class="card shadow-sm border-0">

                        <div class="d-flex align-items-center card-header">
                            <span class="me-2">
                                <a @click="goBack()" class="goback-btn">
                                    <i class="fa-solid fa-arrow-left fs-4 pt-1"></i>
                                </a>
                            </span>

                            <h4 class="mb-0">
                                Riepilogo dell'ordine
                            </h4>
                        </div>

                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="customer_email" class="form-label">Email</label>
                                        <input type="email" v-model="newOrder.customer_email" class="form-control" id="customer_email" minlength="6" maxlength="255" placeholder="Inserisci la tua email" required />
                                    </div>
                                    <div class="mb-3">
                                        <label for="customer_address" class="form-label">Indirizzo</label>
                                        <input type="text" v-model="newOrder.customer_address" class="form-control" id="customer_address" minlength="3" maxlength="255" placeholder="Inserisci il tuo indirizzo" required />
                                    </div>
                                </div>

                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="customer_name" class="form-label">Nome</label>
                                        <input type="text" v-model="newOrder.customer_name" class="form-control" id="customer_name" minlength="3" maxlength="64" placeholder="Inserisci il tuo nome" required />
                                    </div>
                                    <div class="mb-3">
                                        <label for="customer_number" class="form-label">Numero di Telefono</label>
                                        <input type="text" v-model="newOrder.customer_number" class="form-control" id="customer_number" minlength="10" maxlength="18" placeholder="Inserisci il tuo numero di telefono" required />
                                    </div>
                                </div>

                            </div>

                            <div>
                                <div id="dropin-container"></div>
                            </div>
                        </div>
                        
                    </div>
                </div>

                <div class="col-12 col-lg-5">
                    <div v-if="cart.length > 0" class="card shadow-sm border-0">

                        <div class="card-header">
                            <h4 class="mb-0 text-center">Riepilogo</h4>
                        </div>

                        <div class="card-body">

                            <h5 class="card-title ms-3 mb-4 fw-bold">Prodotti:</h5>

                            <ul class="list-group list-group-flush mb-3">
                                <li 
                                    class="list-group-item d-flex justify-content-between align-items-center"
                                    v-for="(item, index) in cart" 
                                    :key="index"
                                >
                                    <div>
                                        <strong>{{ item.item_name }}</strong>
                                        <br>
                                        <small class="text-muted">€{{ item.price }} x {{ item.quantity }}</small>
                                    </div>
                                    <span class="badge bg-warning text-dark">
                                        €{{ (item.price * item.quantity).toFixed(2) }}
                                    </span>
                                </li>
                            </ul>

                            <div class="mt-4 d-flex align-items-center justify-content-between px-3">
                                <h3>
                                    Totale:
                                </h3>
                                <h3>
                                    €{{ cartTotal }}
                                </h3>
                            </div>

                            <div class="d-flex align-items-center justify-content-center my-3">
                                <button 
                                    type="submit" 
                                    class="btn btn-warning" 
                                    :disabled="loading"
                                    >
                                    <span v-if="loading">
                                        <i class="fas fa-spinner fa-spin me-2"></i> Inviando...
                                    </span>
                                    <span v-else>Conferma l'ordine</span>
                                </button>
                            </div>

                        </div>

                    </div>
                </div>
                
            </div>

        </form>

        </div> 
    </div>
</template>

<style lang="scss">
    @use '../assets/scss/main.scss' as *;

    #checkout{
        min-height: calc(100vh - 325px);
        background-color: rgb(255, 246, 235);
    }

    .goback-btn {
    cursor: pointer;
    color: black;
    }

    .card {
    margin-left: 30px;
    border-radius: 15px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);

    .btn-warning {
        border-radius: 30px;
        width: 100%;
        padding: 10px 5px;
        font-size: 1.2rem;
        font-weight: 700;
    }
    }

    .modal-content {
    border-radius: 10px;
    }

    .modal-title {
    color: red;
    }

    #message-confirm {
    h1 {
        font-size: 3.5rem;
    }
    #gif-container {
        position: relative;
        img {
        transform: rotateY(3.142rad);
        }

        #grass {
        width: 220px;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: -30%;
        z-index: -1;

        img {
            filter: brightness(120%);
            max-width: 100%;
        }
        }
    }
    }
</style>