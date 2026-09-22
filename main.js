/* ============================================================
   IMPRIMERIE TENAILLON — Script commun à toutes les pages
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* --- En-tête : fond opaque au scroll --------------------------- */
  const entete = document.querySelector('.entete');
  if (entete) {
    const gererScroll = () => {
      if (window.scrollY > 40) entete.classList.add('scrolled');
      else entete.classList.remove('scrolled');
    };
    gererScroll();
    window.addEventListener('scroll', gererScroll, { passive: true });
  }

  /* --- Menu mobile ------------------------------------------------- */
  const boutonMenu = document.querySelector('.bouton-menu');
  const navPrincipale = document.querySelector('.nav-principale');
  if (boutonMenu && navPrincipale) {
    boutonMenu.addEventListener('click', () => {
      navPrincipale.classList.toggle('ouvert');
      const ouvert = navPrincipale.classList.contains('ouvert');
      boutonMenu.setAttribute('aria-expanded', ouvert ? 'true' : 'false');
    });
    navPrincipale.querySelectorAll('a').forEach(lien => {
      lien.addEventListener('click', () => navPrincipale.classList.remove('ouvert'));
    });
  }

  /* --- Apparition progressive au scroll (fade-in) ------------------- */
  const elementsReveal = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && elementsReveal.length) {
    const observateur = new IntersectionObserver((entrees) => {
      entrees.forEach(entree => {
        if (entree.isIntersecting) {
          entree.target.classList.add('visible');
          observateur.unobserve(entree.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    elementsReveal.forEach(el => observateur.observe(el));
  } else {
    elementsReveal.forEach(el => el.classList.add('visible'));
  }

  /* --- Effet "encre qui se propage" au survol (page Services) -------- */
  document.querySelectorAll('.service-detail').forEach(carte => {
    carte.addEventListener('mousemove', (evenement) => {
      const rect = carte.getBoundingClientRect();
      const x = ((evenement.clientX - rect.left) / rect.width) * 100;
      const y = ((evenement.clientY - rect.top) / rect.height) * 100;
      carte.style.setProperty('--mx', x + '%');
      carte.style.setProperty('--my', y + '%');
    });
  });

  /* --- Filtres de la galerie (page Réalisations) --------------------- */
  const filtres = document.querySelectorAll('.filtre-btn');
  const vignettes = document.querySelectorAll('.galerie-complete .vignette');
  if (filtres.length && vignettes.length) {
    filtres.forEach(bouton => {
      bouton.addEventListener('click', () => {
        filtres.forEach(b => b.classList.remove('actif'));
        bouton.classList.add('actif');
        const categorie = bouton.dataset.filtre;
        vignettes.forEach(vignette => {
          const correspond = categorie === 'tout' || vignette.dataset.categorie === categorie;
          vignette.hidden = !correspond;
        });
      });
    });
  }

  /* --- Accordéon animé (page FAQ) ------------------------------------- */
  document.querySelectorAll('.question-titre').forEach(bouton => {
    bouton.addEventListener('click', () => {
      const panneau = bouton.nextElementSibling;
      const ouvert = bouton.getAttribute('aria-expanded') === 'true';
      bouton.setAttribute('aria-expanded', ouvert ? 'false' : 'true');
      if (ouvert) {
        panneau.style.maxHeight = null;
      } else {
        panneau.style.maxHeight = panneau.scrollHeight + 'px';
      }
    });
  });

  /* --- Nom du fichier sélectionné (page Devis) ------------------------ */
  const champFichier = document.querySelector('.champ-fichier input[type="file"]');
  if (champFichier) {
    const nomFichier = document.querySelector('.champ-fichier .nom-fichier');
    champFichier.addEventListener('change', () => {
      if (champFichier.files.length && nomFichier) {
        const noms = Array.from(champFichier.files).map(f => f.name).join(', ');
        nomFichier.textContent = noms;
      }
    });
  }

  /* --- Copie des coordonnées en un clic (page Contact) ------------------ */
  document.querySelectorAll('.info-copiable').forEach(bouton => {
    bouton.addEventListener('click', async () => {
      const texte = bouton.dataset.copy || '';
      const confirmation = document.querySelector('.info-copie-confirmation');
      try {
        await navigator.clipboard.writeText(texte);
      } catch (erreur) {
        /* Presse-papiers indisponible : on ignore silencieusement */
      }
      if (confirmation) {
        confirmation.hidden = false;
        confirmation.textContent = 'Copié : ' + texte + ' ✓';
        clearTimeout(bouton._timeoutCopie);
        bouton._timeoutCopie = setTimeout(() => { confirmation.hidden = true; }, 2500);
      }
    });
  });

  /* --- Horodatage anti-robot : posé au chargement, vérifié à l'envoi ---- */
  document.querySelectorAll('.horodatage-affichage').forEach(champ => {
    champ.value = String(Date.now());
  });

  /* --- Formulaires : anti-spam basique + confirmation sans backend ------ */
  document.querySelectorAll('form[data-formulaire]').forEach(formulaire => {
    formulaire.addEventListener('submit', (evenement) => {
      evenement.preventDefault();

      /* Piège à robots : un champ invisible rempli = comportement automatisé */
      const piege = formulaire.querySelector('.champ-piege input');
      if (piege && piege.value.trim() !== '') {
        return; /* on n'envoie rien et on n'affiche aucune confirmation */
      }

      /* Délai minimal de remplissage : un envoi trop rapide trahit un script */
      const horodatage = formulaire.querySelector('.horodatage-affichage');
      if (horodatage && horodatage.value) {
        const dureeMs = Date.now() - Number(horodatage.value);
        if (dureeMs < 1500) return;
      }

      const confirmation = formulaire.querySelector('.confirmation-envoi');
      if (confirmation) {
        confirmation.hidden = false;
        formulaire.reset();
        const nomFichierEl = formulaire.querySelector('.nom-fichier');
        if (nomFichierEl) nomFichierEl.textContent = '';
        const horodatageApres = formulaire.querySelector('.horodatage-affichage');
        if (horodatageApres) horodatageApres.value = String(Date.now());
      }
    });
  });

  /* --- Retire le rideau de presse du flux après l'animation ---------- */
  const rideau = document.querySelector('.rideau-presse');
  if (rideau) {
    rideau.addEventListener('animationend', () => {
      rideau.style.display = 'none';
    });
  }

});
