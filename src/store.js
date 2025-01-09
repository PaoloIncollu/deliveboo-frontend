import { reactive } from 'vue';

export const store = reactive({
    

    footerLinks: [

        {

            title: 'Scopri DeliveBoo',
            links: [
                {
                    nameLink: 'Investitori'
                },
                {
                    nameLink: 'Chi siamo'
                },
                {
                    nameLink: 'Ristoranti'
                },
                {
                    nameLink: 'Altro'
                },
            ]
        },


        {

            title: 'Note Legali',
            links: [
                {
                    nameLink: 'Termini & Condizioni'
                },
                {
                    nameLink: 'Informativa sulla privacy'
                },
                {
                    nameLink: 'Cookies'
                },
                {
                    nameLink: 'Partner'
                },
            ]
        },

        {

            title: 'Aiuto',
            links: [
                {
                    nameLink: 'Contatti'
                },
                {
                    nameLink: 'FAQ'
                },
                {
                    nameLink: 'Tipi di cucina'
                }
            ]
        }


    ],


});