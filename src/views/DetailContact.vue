<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useContacts } from '../composables/useContacts'

const route = useRoute()
const router = useRouter()
const { getContact, saveContact } = useContacts()
const editing = computed(() => Boolean(route.params.id))
const original = editing.value ? getContact(route.params.id) : null
const form = ref(original ? { ...original } : { id: null, firstName: '', lastName: '', phone: '', email: '', photo: '' })
const errors = ref({})
const fileInput = ref(null)
const cameraInput = ref(null)
const video = ref(null)
const cameraStream = ref(null)
const cameraOpen = ref(false)
const cameraError = ref('')
const saveMessage = ref('')

function chooseFile(event) {
  const file = event.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => { form.value.photo = reader.result }
  reader.readAsDataURL(file)
}

async function openCamera() {
  cameraError.value = ''
  if (!navigator.mediaDevices?.getUserMedia) {
    cameraError.value = "Cet appareil ne possède pas de caméra accessible. Vous pouvez choisir une photo dans la galerie."
    cameraInput.value?.click()
    return
  }
  try {
    cameraStream.value = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false })
    cameraOpen.value = true
    await new Promise((resolve) => window.setTimeout(resolve, 0))
    video.value.srcObject = cameraStream.value
    await video.value.play()
  } catch {
    cameraError.value = "La caméra n'est pas disponible ou son accès a été refusé. Choisissez une photo dans la galerie."
    cameraInput.value?.click()
  }
}

function capturePhoto() {
  if (!video.value?.videoWidth) return
  const canvas = document.createElement('canvas')
  canvas.width = video.value.videoWidth
  canvas.height = video.value.videoHeight
  canvas.getContext('2d').drawImage(video.value, 0, 0)
  form.value.photo = canvas.toDataURL('image/jpeg', 0.9)
  closeCamera()
}

function closeCamera() {
  cameraStream.value?.getTracks().forEach((track) => track.stop())
  cameraStream.value = null
  cameraOpen.value = false
}

onBeforeUnmount(closeCamera)

function openGmail() {
  const params = new URLSearchParams({
    view: 'cm',
    fs: '1',
    to: form.value.email,
    su: `Message pour ${form.value.firstName} ${form.value.lastName}`,
  })
  window.open(`https://mail.google.com/mail/?${params.toString()}`, '_blank', 'noopener,noreferrer')
}

function validate() {
  const next = {}
  if (!form.value.firstName.trim()) next.firstName = 'Le prénom est obligatoire.'
  if (!form.value.lastName.trim()) next.lastName = 'Le nom est obligatoire.'
  if (!form.value.phone.trim()) next.phone = 'Le téléphone est obligatoire.'
  if (!form.value.email.trim()) next.email = "L'e-mail est obligatoire."
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) next.email = "L'adresse e-mail n'est pas valide."
  errors.value = next
  return Object.keys(next).length === 0
}

function save() {
  if (!validate()) return
  saveContact({ ...form.value, photo: form.value.photo || createFallbackPhoto() })
  saveMessage.value = 'Contact enregistré avec succès.'
  window.setTimeout(() => router.push('/'), 450)
}

function createFallbackPhoto() {
  const initials = `${form.value.firstName[0] || ''}${form.value.lastName[0] || ''}`.toUpperCase()
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><rect width="160" height="160" rx="80" fill="#7c5cff"/><text x="80" y="94" fill="white" font-family="Arial" font-size="48" font-weight="700" text-anchor="middle">${initials}</text></svg>`)}`
}
</script>

<template>
  <section class="detail-page">
    <RouterLink class="back-link" to="/">← Retour aux contacts</RouterLink>
    <div class="detail-heading">
      <div>
        <p class="eyebrow">{{ editing ? 'Fiche contact' : 'Nouveau contact' }}</p>
        <h1>{{ editing ? 'Modifier le contact' : 'Ajouter un contact' }}</h1>
      </div>
      <div class="detail-actions">
        <a v-if="form.phone" class="phone-button" :href="`tel:${form.phone.replace(/\s/g, '')}`">☎ Appeler</a>
        <button v-if="form.email" type="button" class="gmail-button" @click="openGmail">✉ Ouvrir Gmail</button>
      </div>
    </div>
    <form class="contact-form" @submit.prevent="save" novalidate>
      <div class="photo-panel">
        <img v-if="form.photo" class="large-avatar" :src="form.photo" alt="Aperçu de la photo du contact" />
        <div v-else class="large-avatar avatar-placeholder">?</div>
        <h2>Photo du contact</h2>
        <p>Ajoutez une image pour reconnaître facilement ce contact.</p>
        <div class="photo-actions">
          <button type="button" class="gallery-button" @click="fileInput?.click()">▣ Galerie</button>
          <button type="button" class="camera-button" @click="openCamera">◉ Caméra</button>
        </div>
        <input ref="fileInput" class="visually-hidden" type="file" accept="image/*" @change="chooseFile" />
        <input ref="cameraInput" class="visually-hidden" type="file" accept="image/*" capture="environment" @change="chooseFile" />
        <small>Images JPG, PNG ou WEBP</small>
        <p v-if="cameraError" class="camera-error" role="alert">{{ cameraError }}</p>
      </div>
      <div class="fields-panel">
        <div class="form-grid">
          <label>Prénom <input v-model="form.firstName" type="text" placeholder="Ex. Camille" :class="{ invalid: errors.firstName }" /> <small v-if="errors.firstName" class="error">{{ errors.firstName }}</small></label>
          <label>Nom <input v-model="form.lastName" type="text" placeholder="Ex. Martin" :class="{ invalid: errors.lastName }" /> <small v-if="errors.lastName" class="error">{{ errors.lastName }}</small></label>
          <label>Téléphone <input v-model="form.phone" type="tel" placeholder="+33 6 00 00 00 00" :class="{ invalid: errors.phone }" /> <small v-if="errors.phone" class="error">{{ errors.phone }}</small></label>
          <label>E-mail <input v-model="form.email" type="email" placeholder="prenom.nom@example.com" :class="{ invalid: errors.email }" /> <small v-if="errors.email" class="error">{{ errors.email }}</small></label>
        </div>
        <p v-if="saveMessage" class="success-message">{{ saveMessage }}</p>
        <div class="form-footer">
          <RouterLink class="cancel-button" to="/">Annuler</RouterLink>
          <button class="primary-button" type="submit">✓ Enregistrer</button>
        </div>
      </div>
    </form>
    <div v-if="cameraOpen" class="camera-modal" role="dialog" aria-modal="true" aria-label="Prendre une photo">
      <div class="camera-dialog">
        <h2>Prendre une photo</h2>
        <video ref="video" autoplay playsinline muted aria-label="Aperçu de la caméra"></video>
        <div class="camera-controls">
          <button type="button" class="cancel-button" @click="closeCamera">Annuler</button>
          <button type="button" class="capture-button" @click="capturePhoto">● Capturer</button>
        </div>
      </div>
    </div>
  </section>
</template>
