document.addEventListener('DOMContentLoaded', () => {
  const burger = document.getElementById('burger')
  const mobileMenu = document.getElementById('mobileMenu')
  const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : []

  const themeToggleButton = document.getElementById('themeToggle')
  const themeToggleText = themeToggleButton
    ? themeToggleButton.querySelector('.theme-toggle__text')
    : null

  const THEME_STORAGE_KEY = 'autokey-lida-theme'
  const DEFAULT_THEME = 'dark'

  function applyTheme(theme) {
    const resolvedTheme = theme === 'light' ? 'light' : 'dark'

    document.documentElement.setAttribute('data-theme', resolvedTheme)

    if (themeToggleButton) {
      const isLight = resolvedTheme === 'light'

      themeToggleButton.setAttribute('aria-pressed', String(isLight))
      themeToggleButton.setAttribute(
        'aria-label',
        isLight ? 'Переключить на тёмную тему' : 'Переключить на светлую тему'
      )
      themeToggleButton.setAttribute(
        'title',
        isLight ? 'Переключить на тёмную тему' : 'Переключить на светлую тему'
      )
    }
  }

  function getSavedTheme() {
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme
      }
    } catch (error) {
      console.warn('Ошибка чтения localStorage:', error)
    }

    return DEFAULT_THEME
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch (error) {
      console.warn('Ошибка записи в localStorage:', error)
    }
  }

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || DEFAULT_THEME
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark'

    applyTheme(nextTheme)
    saveTheme(nextTheme)
  }

  function toggleMenu(forceState) {
    if (!mobileMenu || !burger) return

    const shouldOpen =
      typeof forceState === 'boolean'
        ? forceState
        : !mobileMenu.classList.contains('is-open')

    mobileMenu.classList.toggle('is-open', shouldOpen)
    burger.classList.toggle('is-active', shouldOpen)
    burger.setAttribute('aria-expanded', String(shouldOpen))
  }

  applyTheme(getSavedTheme())

  if (themeToggleButton) {
    themeToggleButton.addEventListener('click', toggleTheme)
  }

  if (burger) {
    burger.addEventListener('click', () => {
      toggleMenu()
    })
  }

  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => toggleMenu(false))
  })

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      toggleMenu(false)
    }
  })

  const revealElements = document.querySelectorAll('.reveal')

  if ('IntersectionObserver' in window && revealElements.length) {
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
  } else {
    revealElements.forEach((element) => element.classList.add('is-visible'))
  }
})