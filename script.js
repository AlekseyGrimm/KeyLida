const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = mobileMenu.querySelectorAll('a');
const modal = document.getElementById('callbackModal');
const openModalButtons = document.querySelectorAll('[data-open-modal]');
const closeModalButtons = document.querySelectorAll('[data-close-modal]');
const form = document.getElementById('callbackForm');
const successMessage = document.getElementById('formSuccess');
const revealElements = document.querySelectorAll('.reveal');

function toggleMenu(forceState) {
  const shouldOpen = typeof forceState === 'boolean' ? forceState : !mobileMenu.classList.contains('is-open');

  mobileMenu.classList.toggle('is-open', shouldOpen);
  burger.classList.toggle('is-active', shouldOpen);
  burger.setAttribute('aria-expanded', String(shouldOpen));
}

burger.addEventListener('click', () => {
  toggleMenu();
});

mobileLinks.forEach((link) => {
  link.addEventListener('click', () => toggleMenu(false));
});

function openModal() {
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

openModalButtons.forEach((button) => {
  button.addEventListener('click', openModal);
});

closeModalButtons.forEach((button) => {
  button.addEventListener('click', closeModal);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeModal();
    toggleMenu(false);
  }
});

function validateForm(values) {
  return {
    name: values.name.trim() ? '' : 'Введите имя',
    phone: values.phone.trim() ? '' : 'Введите телефон',
  };
}

function setError(fieldName, message) {
  const errorElement = form.querySelector(`[data-error-for="${fieldName}"]`);
  if (errorElement) {
    errorElement.textContent = message;
  }
}

function clearErrors() {
  ['name', 'phone'].forEach((field) => setError(field, ''));
}

// form.addEventListener('submit', (event) => {
//   event.preventDefault();
//   clearErrors();
//   successMessage.classList.remove('is-visible');

//   const formData = new FormData(form);
//   const values = {
//     name: String(formData.get('name') || ''),
//     phone: String(formData.get('phone') || ''),
//   };

//   const errors = validateForm(values);

//   setError('name', errors.name);
//   setError('phone', errors.phone);

//   if (errors.name || errors.phone) {
//     return;
//   }

//   console.log('Заявка:', values);
//   successMessage.classList.add('is-visible');
//   form.reset();

//   setTimeout(() => {
//     successMessage.classList.remove('is-visible');
//     closeModal();
//   }, 1800);
// });

const observer = new IntersectionObserver(
  (entries, observerInstance) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observerInstance.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.16,
  }
);

revealElements.forEach((element) => observer.observe(element));

function runSelfTests() {
  const cases = [
    {
      name: 'empty values',
      input: { name: '', phone: '' },
      expected: { name: 'Введите имя', phone: 'Введите телефон' },
    },
    {
      name: 'only name',
      input: { name: 'Иван', phone: '' },
      expected: { name: '', phone: 'Введите телефон' },
    },
    {
      name: 'valid form',
      input: { name: 'Иван', phone: '+375291112233' },
      expected: { name: '', phone: '' },
    },
  ];

  cases.forEach(({ name, input, expected }) => {
    const actual = validateForm(input);
    const passed = actual.name === expected.name && actual.phone === expected.phone;
    console.assert(passed, `Test failed: ${name}`);
  });
}

runSelfTests();
