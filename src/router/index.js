import { createRouter, createWebHistory } from 'vue-router'
import ListeContacts from '../views/ListeContacts.vue'
import DetailContact from '../views/DetailContact.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'contacts', component: ListeContacts },
    { path: '/contacts/nouveau', name: 'new-contact', component: DetailContact },
    { path: '/contacts/:id', name: 'contact-detail', component: DetailContact },
  ],
  scrollBehavior: () => ({ top: 0 }),
})
