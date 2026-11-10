/**
 * ============================================================================
 * SCRIPT DE VALIDACIÓN Y AUTENTICACIÓN DIDÁCTICA (JavaScript Puro - ES6+)
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Selección de elementos del DOM
  const loginForm = document.getElementById('login-form');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const togglePasswordBtn = document.getElementById('toggle-password');
  const eyeIcon = document.getElementById('eye-icon');
  const rememberMeCheckbox = document.getElementById('remember-me');
  const emailError = document.getElementById('email-error');
  const passwordError = document.getElementById('password-error');
  const globalMessage = document.getElementById('global-message');

  // Credenciales simuladas (DEMO)
  const DEMO_CREDENTIALS = {
    email: 'demo@ejemplo.com',
    password: 'Demo1234!'
  };

  // Clave usada para persistir únicamente el correo en localStorage
  const STORAGE_KEY_EMAIL = 'saved_user_email';

  // --------------------------------------------------------------------------
  // 2. Inicialización: Cargar correo recordado si existe
  // --------------------------------------------------------------------------
  const savedEmail = localStorage.getItem(STORAGE_KEY_EMAIL);
  if (savedEmail) {
    emailInput.value = savedEmail;
    rememberMeCheckbox.checked = true;
  }

  // --------------------------------------------------------------------------
  // 3. Funciones Útiles de Validación
  // --------------------------------------------------------------------------

  /**
   * Comprueba si una cadena tiene una estructura de correo válida usando Regex.
   * @param {string} email 
   * @returns {boolean}
   */
  function isValidEmailFormat(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }

  /**
   * Muestra u oculta el mensaje de error para un campo específico.
   * @param {HTMLElement} inputContainer 
   * @param {HTMLElement} errorElement 
   * @param {string} message 
   */
  function showError(inputContainer, errorElement, message) {
    inputContainer.classList.add('has-error');
    errorElement.textContent = message;
  }

  /**
   * Limpia el mensaje de error de un campo.
   * @param {HTMLElement} inputContainer 
   * @param {HTMLElement} errorElement 
   */
  function clearError(inputContainer, errorElement) {
    inputContainer.classList.remove('has-error');
    errorElement.textContent = '';
  }

  /**
   * Muestra un mensaje global en la parte superior de la tarjeta.
   * @param {string} message 
   * @param {'success' | 'error'} type 
   */
  function showGlobalMessage(message, type) {
    globalMessage.textContent = message;
    globalMessage.className = `global-message ${type}`;
  }

  function hideGlobalMessage() {
    globalMessage.className = 'global-message hidden';
    globalMessage.textContent = '';
  }

  // --------------------------------------------------------------------------
  // 4. Validaciones Específicas de Campos
  // --------------------------------------------------------------------------

  function validateEmail() {
    const emailValue = emailInput.value.trim();
    const parentGroup = emailInput.closest('.form-group');

    if (emailValue === '') {
      showError(parentGroup, emailError, 'El correo electrónico es obligatorio.');
      return false;
    }

    if (!isValidEmailFormat(emailValue)) {
      showError(parentGroup, emailError, 'Ingresa un formato de correo válido.');
      return false;
    }

    clearError(parentGroup, emailError);
    return true;
  }

  function validatePassword() {
    const passwordValue = passwordInput.value.trim();
    const parentGroup = passwordInput.closest('.form-group');

    if (passwordValue === '') {
      showError(parentGroup, passwordError, 'La contraseña es obligatoria.');
      return false;
    }

    if (passwordValue.length < 8) {
      showError(parentGroup, passwordError, 'La contraseña debe tener al menos 8 caracteres.');
      return false;
    }

    clearError(parentGroup, passwordError);
    return true;
  }

  // --------------------------------------------------------------------------
  // 5. Escuchadores de Eventos (Event Listeners)
  // --------------------------------------------------------------------------

  // Limpieza dinámica de errores al escribir en los inputs
  emailInput.addEventListener('input', () => {
    validateEmail();
    hideGlobalMessage();
  });

  passwordInput.addEventListener('input', () => {
    validatePassword();
    hideGlobalMessage();
  });

  // Alternar Visibilidad de Contraseña (Mostrar / Ocultar)
  togglePasswordBtn.addEventListener('click', () => {
    const isPasswordType = passwordInput.getAttribute('type') === 'password';
    
    // Cambia el tipo de input
    passwordInput.setAttribute('type', isPasswordType ? 'text' : 'password');
    
    // Actualiza la accesibilidad y el icono visual
    togglePasswordBtn.setAttribute('aria-label', isPasswordType ? 'Ocultar contraseña' : 'Mostrar contraseña');
    
    if (isPasswordType) {
      // Icono de ojo tachado (Ocultar)
      eyeIcon.innerHTML = `
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
        <line x1="1" y1="1" x2="23" y2="23"></line>
      `;
    } else {
      // Icono de ojo normal (Mostrar)
      eyeIcon.innerHTML = `
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      `;
    }
  });

  // --------------------------------------------------------------------------
  // 6. Procesamiento del Envío del Formulario (Submit)
  // --------------------------------------------------------------------------
  loginForm.addEventListener('submit', (event) => {
    // Evita la recarga automática de la página por defecto del navegador
    event.preventDefault();
    hideGlobalMessage();

    // Ejecuta la validación de ambos campos
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();

    // Si existe algún error en los datos de entrada, cancela el procesamiento
    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    // Datos ingresados por el usuario
    const userEmail = emailInput.value.trim();
    const userPassword = passwordInput.value;

    /* 
     * ========================================================================
     * NOTA EDUCACIONAL Y DE SEGURIDAD IMPORTANTE:
     * ------------------------------------------------------------------------
     * La siguiente validación se realiza localmente y solo tiene fines 
     * pedagógicos/didácticos. EN UN ENTORNO REAL DE PRODUCCIÓN:
     * 1. NUNCA se deben incluir o comparar credenciales fijas en JS del frontend.
     * 2. El JS debe enviar una petición HTTP (por ejemplo, fetch o axios) mediante
     *    HTTPS a un servidor Backend de manera segura.
     * 3. La verificación de contraseñas y emisión de sesiones/tokens (JWT, cookies)
     *    debe ser procesada exclusivamente en el servidor.
     * ========================================================================
     */
    const isAuthSuccessful = (userEmail === DEMO_CREDENTIALS.email) && 
                             (userPassword === DEMO_CREDENTIALS.password);

    if (isAuthSuccessful) {
      showGlobalMessage(`¡Bienvenido de nuevo, ${userEmail}! Redirigiendo...`, 'success');

      // Gestión estricta de la preferencia "Recordar mi correo"
      if (rememberMeCheckbox.checked) {
        localStorage.setItem(STORAGE_KEY_EMAIL, userEmail);
      } else {
        localStorage.removeItem(STORAGE_KEY_EMAIL);
      }

    } else {
      showGlobalMessage('Credenciales incorrectas. Verifica tu correo y contraseña.', 'error');
    }
  });
});