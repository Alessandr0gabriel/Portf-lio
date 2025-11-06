// DOM Elements
const header = document.querySelector(".header");
const mobileMenu = document.getElementById("mobileMenu");
const scrollToTopBtn = document.getElementById("scrollToTopBtn");
const toast = document.getElementById("toast");
const contactForm = document.getElementById("contactForm");
const currentYearSpan = document.getElementById("currentYear");

// Set current year in footer
currentYearSpan.textContent = new Date().getFullYear();

// Handle scroll events
window.addEventListener("scroll", () => {
  // Add/remove scrolled class to header
  if (window.scrollY > 20) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }

  // Show/hide scroll to top button
  if (window.pageYOffset > 300) {
    scrollToTopBtn.classList.add("active");
  } else {
    scrollToTopBtn.classList.remove("active");
  }

  // Check for elements to animate on scroll
  animateOnScroll();
});

// Toggle mobile menu
function toggleMobileMenu() {
  mobileMenu.classList.toggle("active");
}

// Scroll to section
function scrollToSection(id) {
  const element = document.getElementById(id);
  if (element) {
    // Close mobile menu if open
    mobileMenu.classList.remove("active");

    // Calculate position with offset for header
    const headerHeight = header.offsetHeight;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

    // Scroll to section
    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }
}

// Scroll to top
scrollToTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

// Contact form submission
if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Validação
    if (!validateForm()) return;

    const form = e.target;
    const formData = new FormData(form);

    // Evita envios duplicados
    const submitBtn = form.querySelector(".submit-btn");
    if (submitBtn) {
      submitBtn.textContent = "Enviando...";
      submitBtn.disabled = true;
    }

    try {
      const response = await fetch(
        form.action || "https://formspree.io/f/mzzkndjk",
        {
          method: form.method || "POST",
          body: formData,
          headers: { Accept: "application/json" },
        }
      );

      if (response.ok) {
        showToast(
          "success",
          "Mensagem Enviada!",
          "Obrigado pela sua mensagem. Responderei em breve."
        );
        form.reset();
      } else {
        let errorBody = null;
        try {
          errorBody = await response.json();
        } catch (_) {}
        console.error("Formspree Error:", errorBody);
        showToast(
          "error",
          "Erro de Envio",
          "Houve um problema ao enviar a mensagem. Tente novamente."
        );
      }
    } catch (error) {
      console.error("Network Error:", error);
      showToast(
        "error",
        "Erro de Conexão",
        "Erro de rede. Verifique sua conexão e tente novamente."
      );
    } finally {
      if (submitBtn) {
        submitBtn.textContent = "Enviar Mensagem";
        submitBtn.disabled = false;
      }
    }
  });
}

// Form validation
function validateForm() {
  let isValid = true;

  // Get form fields
  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const subject = document.getElementById("subject");
  const message = document.getElementById("message");

  // Clear previous error messages
  clearErrors();

  // Validate name
  if (name.value.trim() === "" || name.value.trim().length < 2) {
    showError("nameError", "O nome deve ter pelo menos 2 caracteres.");
    isValid = false;
  }

  // Validate email
  if (!isValidEmail(email.value)) {
    showError("emailError", "Por favor, insira um endereço de email válido.");
    isValid = false;
  }

  // Validate subject
  if (subject.value.trim() === "" || subject.value.trim().length < 2) {
    showError("subjectError", "O assunto deve ter pelo menos 2 caracteres.");
    isValid = false;
  }

  // Validate message
  if (message.value.trim() === "" || message.value.trim().length < 10) {
    showError("messageError", "A mensagem deve ter pelo menos 10 caracteres.");
    isValid = false;
  }

  return isValid;
}

// Show error message
function showError(id, message) {
  const errorElement = document.getElementById(id);
  errorElement.textContent = message;
  errorElement.classList.add("active");
}

// Clear all error messages
function clearErrors() {
  const errorElements = document.querySelectorAll(".error-message");
  errorElements.forEach((element) => {
    element.textContent = "";
    element.classList.remove("active");
  });
}

// Validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Show toast notification
function showToast(type, title, message) {
  const toastIcon = document.querySelector(".toast-icon");
  const toastTitle = document.querySelector(".toast-title");
  const toastMessage = document.querySelector(".toast-message");

  if (!toastIcon || !toastTitle || !toastMessage) return;

  // Reset classes and set type class
  toastIcon.className = "toast-icon";
  toastIcon.classList.add(type === "success" ? "success" : "error");

  // Ícone conforme tipo
  toastIcon.innerHTML =
    type === "success"
      ? '<i class="fas fa-check"></i>'
      : '<i class="fas fa-times"></i>';

  toastTitle.textContent = title;
  toastMessage.textContent = message;

  // Mostra toast
  toast.classList.add("active");

  // Auto-hide após 5s
  setTimeout(closeToast, 5000);
}

// Close toast notification
function closeToast() {
  toast.classList.remove("active");
}

// Animate elements when they come into view
function animateOnScroll() {
  const animateItems = document.querySelectorAll(".animate-item");

  animateItems.forEach((item) => {
    const itemPosition = item.getBoundingClientRect().top;
    const screenPosition = window.innerHeight / 1.2;

    if (itemPosition < screenPosition) {
      item.classList.add("animate-visible");
    }
  });
}

// Initialize page
window.addEventListener("DOMContentLoaded", () => {
  // Animate items initially visible on page load
  animateOnScroll();

  // Add event listeners for any external links
  document.querySelectorAll('a[href^="http"]').forEach((link) => {
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
  });
});
