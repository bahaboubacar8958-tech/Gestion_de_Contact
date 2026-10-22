<script setup>
defineProps({ contact: { type: Object, required: true } })
</script>

<template>
  <article class="contact-card">
    <img class="contact-avatar" :src="contact.photo" :alt="`Photo de ${contact.firstName} ${contact.lastName}`" />
    <div class="contact-info">
      <h2>{{ contact.firstName }} {{ contact.lastName }}</h2>
      <a :href="`tel:${contact.phone.replace(/\s/g, '')}`">{{ contact.phone }}</a>
      <span>{{ contact.email }}</span>
    </div>
    <RouterLink class="edit-button" :to="`/contacts/${contact.id}`">Modifier <span>→</span></RouterLink>
  </article>
</template>
