const burger = document.getElementById('burger')
const mobileMenu = document.getElementById('mobileMenu')
const mobileLinks = mobileMenu.querySelectorAll('a')
const modal = document.getElementById('callbackModal')
const openModalButtons = document.querySelectorAll('[data-open-modal]')
const closeModalButtons = document.querySelectorAll('[data-close-modal]')
const form = document.getElementById('callbackForm')
const revealElements = document.querySelectorAll('.reveal')

function toggleMenu(forceState) {
  const shouldOpen = typeof forceState === 'boolean' ? forceState : !mobileMenu.classList.contains('is-open')

  mobileMenu.classList.toggle('is-open', shouldOpen)
  burger.classList.toggle('is-active', shouldOpen)
  burger.setAttribute('aria-expanded', String(shouldOpen))
}

burger.addEventListener('click', () => {
  toggleMenu()
})

mobileLinks.forEach((link) => {
  link.addEventListener('click', () => toggleMenu(false))
})

function openModal() {
  modal.classList.add('is-open')
  modal.setAttribute('aria-hidden', 'false')
  document.body.style.overflow = 'hidden'
}

function closeModal() {
  modal.classList.remove('is-open')
  modal.setAttribute('aria-hidden', 'true')
  document.body.style.overflow = ''
}

openModalButtons.forEach((button) => {
  button.addEventListener('click', openModal)
})

closeModalButtons.forEach((button) => {
  button.addEventListener('click', closeModal)
})

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeModal()
    toggleMenu(false)
  }
})

function validateForm(values) {
  return {
    name: values.name.trim() ? '' : 'Введите имя',
    phone: values.phone.trim() ? '' : 'Введите телефон',
  }
}

function setError(fieldName, message) {
  const errorElement = form.querySelector(`[data-error-for="${fieldName}"]`)
  if (errorElement) {
    errorElement.textContent = message
  }
}

function clearErrors() {
  ['name', 'phone'].forEach((field) => setError(field, ''))
}

const observer = new IntersectionObserver(
  (entries, observerInstance) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
        observerInstance.unobserve(entry.target)
      }
    })
  },
  {
    threshold: 0.16,
  }
)

revealElements.forEach((element) => observer.observe(element))