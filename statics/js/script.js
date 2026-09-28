if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

window.addEventListener('pageshow', () => {
  window.setTimeout(() => {
    if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    window.scrollTo(0, 0);
  }, 0);
});

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
  const telephoneInput = document.querySelector('#telephone');
  const commentaireInput = document.querySelector('#commentaire');
  const characterCount = document.querySelector('.character-count');
  const updateCharacterCount = () => {
    if (commentaireInput && characterCount) {
      commentaireInput.value = commentaireInput.value.slice(0, 200);
      characterCount.textContent = `${commentaireInput.value.length}/200 caractères`;
    }
  };

  if (telephoneInput) {
    telephoneInput.addEventListener('input', () => {
      telephoneInput.value = telephoneInput.value.replace(/[^0-9+ ]/g, '');
    });
  }

  if (commentaireInput && characterCount) {
    commentaireInput.addEventListener('input', updateCharacterCount);
    updateCharacterCount();
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
          updateCharacterCount();
          
          // Mise à jour visuelle des places disponibles après inscription
          reduirePlacesDisponibles();
        }
      } catch {
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

  const animatedElements = document.querySelectorAll('.grille-info, .grille-form, .detail-item, .detail-item h3, .detail-item p, .buton-inscr, citation');

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
