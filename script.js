// Configuración de Supabase
// IMPORTANTE: Reemplaza estos valores con los de tu proyecto de Supabase
const SUPABASE_URL = 'https://iorykixcqnyjwlvpumjf.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvcnlraXhjcW55andsdnB1bWpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5NzkzNjIsImV4cCI6MjA2ODU1NTM2Mn0.HW326oC21fqsOls6pXSejPRBTqiNg-WM2s5tHyimgf8'



// Inicializar cliente de Supabase
const supabaseClient = typeof supabase !== 'undefined' ? supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null

// Mobile navigation toggle
const navToggle = document.querySelector(".nav__toggle")
const navLinks = document.querySelector(".nav__links")

if (navToggle) {
  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("nav__links--active")
    navToggle.classList.toggle("nav__toggle--active")
  })
}

// Header scroll effect
const header = document.querySelector(".header")
let lastScrollY = window.scrollY

window.addEventListener("scroll", () => {
  const currentScrollY = window.scrollY

  if (currentScrollY > 100) {
    header.style.background = "rgba(0, 0, 0, 0.95)"
  } else {
    header.style.background = "rgba(0, 0, 0, 0.8)"
  }

  lastScrollY = currentScrollY
})

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animate")
    }
  })
}, observerOptions)

// Observe feature items for animation
document.querySelectorAll(".features__item").forEach((item) => {
  observer.observe(item)
})

// Add loading states and error handling for images
document.querySelectorAll("img").forEach((img) => {
  img.addEventListener("load", function () {
    this.style.opacity = "1"
  })

  img.addEventListener("error", function () {
    this.style.opacity = "0.5"
    console.warn("Failed to load image:", this.src)
  })

  // Set initial opacity for smooth loading
  img.style.opacity = "0"
  img.style.transition = "opacity 0.3s ease"
})

// MODAL FUNCTIONALITY
const modal = document.getElementById('waitlistModal')
const closeModalBtn = document.getElementById('closeModal')
const waitlistForm = document.getElementById('waitlistForm')
const successState = document.getElementById('successState')
const successCloseBtn = document.getElementById('successClose')
const submitBtn = document.getElementById('submitBtn')
const submitText = submitBtn.querySelector('.submit__text')
const submitLoader = submitBtn.querySelector('.submit__loader')
const nombreInput = document.getElementById('nombre')
const emailInput = document.getElementById('email')
const nombreError = document.getElementById('nombreError')
const emailError = document.getElementById('emailError')

// Función para abrir el modal
function openModal() {
  modal.classList.add('active')
  document.body.style.overflow = 'hidden'
  // Reset form state
  resetForm()
}

// Función para cerrar el modal
function closeModal() {
  modal.classList.remove('active')
  document.body.style.overflow = ''
  // Reset form after a delay to allow animation
  setTimeout(resetForm, 300)
}

// Función para resetear el formulario
function resetForm() {
  waitlistForm.style.display = 'block'
  successState.style.display = 'none'
  waitlistForm.reset()
  clearErrors()
  resetSubmitButton()
}

// Función para limpiar errores
function clearErrors() {
  nombreInput.classList.remove('error')
  emailInput.classList.remove('error')
  nombreError.textContent = ''
  emailError.textContent = ''
}

// Función para mostrar errores
function showError(field, message) {
  if (field === 'nombre') {
    nombreInput.classList.add('error')
    nombreError.textContent = message
  } else if (field === 'email') {
    emailInput.classList.add('error')
    emailError.textContent = message
  }
}

// Función para resetear el botón de submit
function resetSubmitButton() {
  submitBtn.classList.remove('loading')
  submitBtn.disabled = false
  submitText.style.opacity = '1'
  submitLoader.style.display = 'none'
}

// Función para mostrar loading en el botón
function showLoadingButton() {
  submitBtn.classList.add('loading')
  submitBtn.disabled = true
  submitText.style.opacity = '0'
  submitLoader.style.display = 'block'
}

// Función para mostrar estado de éxito
function showSuccessState() {
  waitlistForm.style.display = 'none'
  successState.style.display = 'block'
}

// Validación del formulario
function validateForm(formData) {
  const errors = {}
  
  // Validar nombre
  if (!formData.nombre || formData.nombre.trim().length < 2) {
    errors.nombre = 'El nombre debe tener al menos 2 caracteres'
  }
  
  if (formData.nombre && formData.nombre.trim().length > 100) {
    errors.nombre = 'El nombre no puede exceder 100 caracteres'
  }
  
  // Validar email
  if (!formData.email || formData.email.trim().length === 0) {
    errors.email = 'El correo electrónico es obligatorio'
  } else {
    // Expresión regular para validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email.trim())) {
      errors.email = 'Ingresa un correo electrónico válido'
    }
  }
  
  if (formData.email && formData.email.trim().length > 255) {
    errors.email = 'El correo electrónico es demasiado largo'
  }
  
  return errors
}

// Función para enviar datos a Supabase
async function submitToWaitlist(formData) {
  // Verificar que Supabase esté disponible
  if (!supabaseClient) {
    throw new Error('Supabase no está configurado correctamente')
  }

  try {
    const { data, error } = await supabaseClient
      .from('profiles') // Nombre de tu tabla en Supabase
      .insert([
        {
          nombre: formData.nombre.trim(),
          email: formData.email.trim().toLowerCase(),
          fecha_registro: new Date().toISOString(),
          // Puedes agregar más campos aquí según tu esquema de base de datos
        }
      ])
    
    if (error) {
      throw error
    }
    
    return { success: true, data }
  } catch (error) {
    console.error('Error al guardar en Supabase:', error)
    return { success: false, error: error.message }
  }
}

// Event listeners para abrir el modal
document.querySelectorAll('.hero__cta').forEach(button => {
  button.addEventListener('click', (e) => {
    e.preventDefault()
    openModal()
  })
})

// Event listeners para cerrar el modal
closeModalBtn.addEventListener('click', closeModal)
successCloseBtn.addEventListener('click', closeModal)

// Cerrar modal al hacer click en el overlay
modal.addEventListener('click', (e) => {
  if (e.target === modal || e.target.classList.contains('modal__overlay')) {
    closeModal()
  }
})

// Cerrar modal con la tecla Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('active')) {
    closeModal()
  }
})

// Limpiar errores cuando el usuario empiece a escribir
nombreInput.addEventListener('input', () => {
  if (nombreInput.classList.contains('error')) {
    nombreInput.classList.remove('error')
    nombreError.textContent = ''
  }
})

emailInput.addEventListener('input', () => {
  if (emailInput.classList.contains('error')) {
    emailInput.classList.remove('error')
    emailError.textContent = ''
  }
})

// Manejar el envío del formulario
waitlistForm.addEventListener('submit', async (e) => {
  e.preventDefault()
  
  // Limpiar errores previos
  clearErrors()
  
  // Obtener datos del formulario
  const formData = {
    nombre: nombreInput.value,
    email: emailInput.value
  }
  
  // Validar datos
  const errors = validateForm(formData)
  
  // Mostrar errores si los hay
  if (Object.keys(errors).length > 0) {
    Object.keys(errors).forEach(field => {
      showError(field, errors[field])
    })
    return
  }
  
  // Mostrar loading
  showLoadingButton()
  
  try {
    // Enviar a Supabase
    const result = await submitToWaitlist(formData)
    
    if (result.success) {
      // Mostrar estado de éxito
      showSuccessState()
      
      // Opcional: Analytics o tracking
      console.log('Usuario agregado a la lista de espera:', {
        nombre: formData.nombre,
        email: formData.email
      })
    } else {
      // Mostrar error genérico o específico
      if (result.error && result.error.includes('duplicate') || result.error.includes('unique')) {
        showError('email', 'Este correo ya está registrado en nuestra lista')
      } else {
        showError('email', 'Error al procesar la solicitud. Inténtalo de nuevo.')
      }
      resetSubmitButton()
    }
  } catch (error) {
    console.error('Error inesperado:', error)
    showError('email', 'Error de conexión. Inténtalo de nuevo.')
    resetSubmitButton()
  }
})

// Form handling (existing code for other buttons)
document.querySelectorAll("button, .cta__button").forEach((button) => {
  // Skip the waitlist buttons as they're handled separately
  if (button.classList.contains('hero__cta')) return
  
  button.addEventListener("click", function (e) {
    // Add click animation
    this.style.transform = "scale(0.98)"
    setTimeout(() => {
      this.style.transform = ""
    }, 150)
  })
})