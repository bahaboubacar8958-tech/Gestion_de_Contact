<script setup>
import ContactCard from '../components/ContactCard.vue'
import { computed, ref } from 'vue'
import { useContacts } from '../composables/useContacts'

const { contacts, count } = useContacts()
const search = ref('')
const filteredContacts = computed(() => {
  const term = search.value.trim().toLowerCase()
  if (!term) return contacts.value
  return contacts.value.filter((contact) =>
    [contact.firstName, contact.lastName, contact.phone, contact.email].some((value) =>
      value.toLowerCase().includes(term),
    ),
  )
})
</script>

<template>
  <section class="list-page">
    <div class="page-heading">
      <div>
        <p class="eyebrow">Votre carnet personnel</p>
        <h1>Mes contacts <span class="count-badge">{{ count }}</span></h1>
        <p class="intro">Retrouvez rapidement les personnes importantes pour vous.</p>
      </div>
      <RouterLink class="primary-button" to="/contacts/nouveau"><span>＋</span> Ajouter un contact</RouterLink>
    </div>
    <label class="search-box">
      <span aria-hidden="true">⌕</span>
      <input v-model="search" type="search" placeholder="Rechercher un contact..." aria-label="Rechercher un contact" />
    </label>
    <div class="contact-list" aria-live="polite">
      <ContactCard v-for="contact in filteredContacts" :key="contact.id" :contact="contact" />
    </div>
    <div v-if="!filteredContacts.length" class="empty-state">
      <div class="empty-icon">♡</div>
      <h2>{{ contacts.length ? 'Aucun contact trouvé' : 'Votre carnet est vide' }}</h2>
      <p>{{ contacts.length ? 'Essayez avec un autre nom, numéro ou e-mail.' : 'Ajoutez votre premier contact pour commencer.' }}</p>
      <RouterLink v-if="!contacts.length" class="primary-button" to="/contacts/nouveau">Ajouter un contact</RouterLink>
    </div>
  </section>
</template>
