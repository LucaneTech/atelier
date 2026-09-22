document.addEventListener('DOMContentLoaded', () => {
    
  /* ==========================================
     1. GESTION DU FORMULAIRE (Formspree AJAX)
     ========================================== */
  const form = document.querySelector('.grille-form form');
  const telephoneInput = document.querySelector('#telephone');

  if (telephoneInput) {
    telephoneInput.addEventListener('input', () => {
      telephoneInput.value = telephoneInput.value.replace(/[^0-9+ ]/g, '');
    });
  }
  
  if (form) {
    // Création d'une zone de message de retour
    const statusMessage = document.createElement('div');
    statusMessage.className = 'form-status';
    statusMessage.style.marginTop = '1rem';
    statusMessage.style.fontWeight = '600';
    statusMessage.style.textAlign = 'center';
    form.appendChild(statusMessage);

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;
      
      // État de chargement
      submitBtn.disabled = true;
      submitBtn.textContent = "Envoi en cours...";
      statusMessage.textContent = "";

      const formData = new FormData(form);

      try {
        const response = await fetch(form.action, {
          method: form.method,
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          statusMessage.style.color = '#27ae60';
          statusMessage.textContent = "✅ Inscription réussie ! Nous vous contacterons rapidement.";
          form.reset();
          
          // Mise à jour visuelle des places disponibles après inscription
          reduirePlacesDisponibles();
        } else {
          const data = await response.json();
          statusMessage.style.color = '#e74c3c';
          if (Object.hasOwn(data, 'errors')) {
            statusMessage.textContent = data.errors.map(error => error["message"]).join(", ");
          } else {
            statusMessage.textContent = "❌ Une erreur s'est produite lors de l'envoi.";
          }
        }
      } catch (error) {
        statusMessage.style.color = '#e74c3c';
        statusMessage.textContent = "❌ Erreur de réseau. Veuillez vérifier votre connexion.";
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
    });
  }


 
  /* ==========================================
     4. ANIMATION DE DÉROULEMENT (Scroll Reveal)
     ========================================== */
  const animatedElements = document.querySelectorAll('.grille-info, .grille-form, citation');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.2 });

  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
    observer.observe(el);
  });

});

 /* ==========================================
     3. COMPTE À REBOURS (Jusqu'au 3 Octobre 2026)
   
  const eventDate = new Date('2026-10-03T14:00:00').getTime();
  const dateDetailItem = document.querySelectorAll('.detail-item')[0];

  if (dateDetailItem) {
    const countdownBox = document.createElement('div');
    countdownBox.className = 'countdown-timer';
    countdownBox.style.fontSize = '0.85rem';
    countdownBox.style.marginTop = '0.4rem';
    countdownBox.style.color = 'var(--primary-color)';
    countdownBox.style.fontWeight = '700';
    dateDetailItem.appendChild(countdownBox);

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = eventDate - now;

      if (distance < 0) {
        countdownBox.textContent = "L'événement a commencé !";
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

      countdownBox.textContent = `⏳ Dans ${days}j ${hours}h ${minutes}m`;
    };

    updateCountdown();
    setInterval(updateCountdown, 60000); // Mise à jour toutes les minutes
  }
  ========================================== */
    /* ==========================================
     2. GESTION DYNAMIQUE DES PLACES DISPONIBLES
   
  let placesRestantes = 15; // Nombre initial
  const limitElement = document.querySelector('.detail-item .limit');

  function reduirePlacesDisponibles() {
    if (limitElement && placesRestantes > 0) {
      placesRestantes--;
      if (placesRestantes === 0) {
        limitElement.textContent = "🚫 COMPLET — Plus de places disponibles";
        limitElement.style.color = "#d63031";
        
        // Désactiver le formulaire si complet
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.disabled = true;
      } else {
        limitElement.textContent = `⚠️ ${placesRestantes} places restantes max`;
      }
    }
  }
  ========================================== */