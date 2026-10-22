import { computed, ref } from 'vue'

const avatar = (initials, background, foreground = '#ffffff') =>
  `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160"><rect width="160" height="160" rx="80" fill="${background}"/><text x="80" y="94" fill="${foreground}" font-family="Arial,sans-serif" font-size="48" font-weight="700" text-anchor="middle">${initials}</text></svg>`)}`

const defaults = [
  { id: 1, firstName: 'Camille', lastName: 'Martin', phone: '+33 6 12 34 56 78', email: 'camille.martin@example.com', photo: avatar('CM', '#7c5cff') },
  { id: 2, firstName: 'Thomas', lastName: 'Bernard', phone: '+33 6 23 45 67 89', email: 'thomas.bernard@example.com', photo: avatar('TB', '#ef8354') },
  { id: 3, firstName: 'Julie', lastName: 'Petit', phone: '+33 6 34 56 78 90', email: 'julie.petit@example.com', photo: avatar('JP', '#18a999') },
  { id: 4, firstName: 'Lucas', lastName: 'Robert', phone: '+33 6 45 67 89 01', email: 'lucas.robert@example.com', photo: avatar('LR', '#de6397') },
  { id: 5, firstName: 'Sarah', lastName: 'Durand', phone: '+33 6 56 78 90 12', email: 'sarah.durand@example.com', photo: avatar('SD', '#e8a317') },
]

const saved = localStorage.getItem('contactly-contacts')
const contacts = ref(saved ? JSON.parse(saved) : defaults)

function persist() {
  localStorage.setItem('contactly-contacts', JSON.stringify(contacts.value))
}

export function useContacts() {
  const count = computed(() => contacts.value.length)
  const getContact = (id) => contacts.value.find((contact) => String(contact.id) === String(id))

  function saveContact(contact) {
    const index = contacts.value.findIndex((item) => item.id === contact.id)
    if (index === -1) contacts.value.push({ ...contact, id: Date.now() })
    else contacts.value[index] = { ...contact }
    persist()
  }

  return { contacts, count, getContact, saveContact }
}
