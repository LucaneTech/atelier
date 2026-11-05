document.addEventListener('DOMContentLoaded', () => {
  const pageContent = document.querySelector('.page-content');
  if (pageContent) {
    document.body.classList.add('is-opening');
    window.setTimeout(() => {
      pageContent.classList.add('bg-focused');
      window.setTimeout(() => document.body.classList.remove('is-opening'), 1200);
    }, 3000);
  }

  /* ==========================================
     1. GESTION DU FORMULAIRE (Formspree AJAX)
     ========================================== */
     const form = document.querySelector('.grille-form form');
     const difficultyOptions = form
       ? form.querySelectorAll('input[name="difficultes"]')
       : [];
     const updateDifficultyValidity = () => {
       if (difficultyOptions.length === 0) return;

       const hasSelection = Array.from(difficultyOptions).some(option => option.checked);
       difficultyOptions[0].setCustomValidity(
         hasSelection ? '' : 'Veuillez sélectionner au moins une difficulté.'
       );
     };

     if (form) {
       if (difficultyOptions.length > 0) {
         difficultyOptions.forEach(option => {
           option.addEventListener('change', updateDifficultyValidity);
         });
         updateDifficultyValidity();
       }
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
          window.location.assign(new URL(form.dataset.successUrl, window.location.href).href);
          return;
        } else {
          statusMessage.style.color = '#e74c3c';
          statusMessage.textContent = "L'envoi a échoué. Vérifiez vos réponses puis réessayez.";
        }
      } catch (error) {
        console.error("Erreur lors de l'envoi du formulaire :", error);
        statusMessage.style.color = '#e74c3c';
        statusMessage.textContent = "Impossible d'envoyer votre inscription. Vérifiez votre connexion puis réessayez.";
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
    });
  }


 
  /* ==========================================
     4. ANIMATION DE DÉROULEMENT (Scroll Reveal)
     ========================================== */
  const heroText = document.querySelector('.hero-text');
  if (heroText) {
    const updateHeroTextVisibility = () => {
      const bounds = heroText.getBoundingClientRect();
      const isVisible = bounds.top < window.innerHeight * 0.65 && bounds.bottom > window.innerHeight * 0.35;
      heroText.classList.toggle('is-visible', isVisible);
    };

    const heroTextObserver = new IntersectionObserver(([entry]) => {
      heroText.classList.toggle('is-visible', entry.isIntersecting);
    }, { threshold: 0.35 });

    heroTextObserver.observe(heroText);
    updateHeroTextVisibility();
  }

  const animatedElements = document.querySelectorAll('.formation-promo, .grille-info, .grille-form, .detail-item, .detail-item h3, .detail-item p, .buton-inscr, citation');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      entry.target.classList.toggle('scroll-reveal', true);
      entry.target.classList.toggle('is-visible', entry.isIntersecting);
    });
  }, { threshold: 0.2 });

  const updateAnimatedVisibility = () => {
    animatedElements.forEach(element => {
      const bounds = element.getBoundingClientRect();
      const isVisible = bounds.top < window.innerHeight * 0.85 && bounds.bottom > window.innerHeight * 0.15;
      element.classList.toggle('is-visible', isVisible);
    });
  };

  animatedElements.forEach(el => {
    el.classList.add('scroll-reveal');
    observer.observe(el);
  });

  updateAnimatedVisibility();

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

   function reduirePlacesDisponibles() {
    if (limitElement && placesRestantes > 0) {
      placesRestantes--;
      limitElement.textContent = placesRestantes === 0
        ? "COMPLET - Plus de places disponibles"
        : `⚠️ ${placesRestantes} places restantes max`;

      if (placesRestantes === 0 && form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.disabled = true;
      }
    }
  }
  ========================================== */
