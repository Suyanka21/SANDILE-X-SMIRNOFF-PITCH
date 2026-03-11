/* ============================================
   SANDILE x SMIRNOFF - AVENGERS ASSEMBLE
   Cinematic Scroll-Driven Experience
   ============================================ */

(function () {
  'use strict';

  /* ---------- SCROLL PROGRESS BAR ---------- */
  function initScrollProgress() {
    var bar = document.querySelector('.scroll-progress');
    if (!bar) return;

    function updateProgress() {
      var scrollTop = window.scrollY || document.documentElement.scrollTop;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = progress + '%';
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  /* ---------- SCROLL FADE-IN (IntersectionObserver) ---------- */
  function initFadeIn() {
    var elements = document.querySelectorAll('.fade-in');
    if (!elements.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ---------- COCKTAIL FLIPBOOK (Removed) ---------- */


  /* ---------- COCKTAIL CARDS INTERACTION ---------- */
  function initCocktailCards() {
    var cards = document.querySelectorAll('.cocktail-video-card');
    cards.forEach(function(card) {
      card.addEventListener('click', function() {
        // Toggle active class for mobile tap
        var isActive = this.classList.contains('active');
        cards.forEach(function(c) { c.classList.remove('active'); });
        if (!isActive) {
          this.classList.add('active');
        }
      });
    });
  }

  /* ---------- SLIDE DECK MODAL ---------- */
  function initDeck() {
    var modal = document.getElementById('deckModal');
    if (!modal) return;

    var openBtn = document.getElementById('openDeck');
    var closeBtn = document.getElementById('closeDeck');
    var prevBtn = document.getElementById('prevSlide');
    var nextBtn = document.getElementById('nextSlide');
    var currentDisplay = document.getElementById('currentSlide');
    var totalDisplay = document.getElementById('totalSlides');
    var slides = modal.querySelectorAll('.slide');
    var dots = modal.querySelectorAll('.deck-dot');

    if (!slides.length) return;

    var current = 0;
    var total = slides.length;
    if (totalDisplay) totalDisplay.textContent = total;

    function updateDots() {
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === current);
      });
    }

    function goToSlide(index) {
      if (index < 0 || index >= total || index === current) return;

      slides[current].classList.remove('active');
      current = index;
      slides[current].classList.add('active');
      if (currentDisplay) currentDisplay.textContent = current + 1;

      // Update nav button states
      if (prevBtn) prevBtn.disabled = current === 0;
      if (nextBtn) nextBtn.disabled = current === total - 1;

      updateDots();
    }

    function nextSlide() {
      if (current < total - 1) goToSlide(current + 1);
    }

    function prevSlide() {
      if (current > 0) goToSlide(current - 1);
    }

    function openModal() {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
      // Reset to first slide
      slides.forEach(function (s) {
        s.classList.remove('active');
      });
      current = 0;
      slides[0].classList.add('active');
      if (currentDisplay) currentDisplay.textContent = 1;
      if (prevBtn) prevBtn.disabled = true;
      if (nextBtn) nextBtn.disabled = total <= 1;
      updateDots();
    }

    function closeModal() {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }

    if (openBtn) openBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    // Dot navigation
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        goToSlide(i);
      });
    });

    // Keyboard navigation
    document.addEventListener('keydown', function (e) {
      if (!modal.classList.contains('open')) return;
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') nextSlide();
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') prevSlide();
    });

    // Click outside to close
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });

    // Touch swipe support
    var touchStartX = 0;
    var touchEndX = 0;

    modal.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    modal.addEventListener('touchend', function (e) {
      touchEndX = e.changedTouches[0].screenX;
      var diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) nextSlide();
        else prevSlide();
      }
    }, { passive: true });
  }

  /* ---------- KINETIC TYPOGRAPHY ---------- */
  function initKineticTypography() {
    var elements = document.querySelectorAll('.kinetic-text');
    if (!elements.length) return;

    // Helper to wrap characters
    function wrapCharacters(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        var text = node.textContent;
        if (!text.trim()) return node;
        
        var fragment = document.createDocumentFragment();
        var words = text.split(/(\s+)/);
        
        words.forEach(function(word) {
          if (word.trim() === '') {
            fragment.appendChild(document.createTextNode(word));
          } else {
            var wordSpan = document.createElement('span');
            wordSpan.className = 'kinetic-word';
            
            for (var i = 0; i < word.length; i++) {
              var charSpan = document.createElement('span');
              charSpan.className = 'kinetic-char';
              charSpan.textContent = word[i];
              wordSpan.appendChild(charSpan);
            }
            fragment.appendChild(wordSpan);
          }
        });
        return fragment;
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        var childNodes = Array.from(node.childNodes);
        childNodes.forEach(function(child) {
          var replacement = wrapCharacters(child);
          if (replacement !== child) {
            node.replaceChild(replacement, child);
          }
        });
        return node;
      }
      return node;
    }

    elements.forEach(function(el) {
      wrapCharacters(el);
      
      // Set staggered delays
      var chars = el.querySelectorAll('.kinetic-char');
      chars.forEach(function(char, index) {
        char.style.transitionDelay = (index * 0.015) + 's';
      });
    });

    // Observe for reveal
    var observer = new IntersectionObserver(
      function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Optional: unobserve if we only want it once
            // observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
    );

    elements.forEach(function(el) {
      observer.observe(el);
    });
  }

  /* ---------- VIDEO LAZY LOADING ---------- */
  function initVideoLazyLoad() {
    var videos = document.querySelectorAll('video[preload="metadata"]');

    var videoObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var video = entry.target;
            var playPromise = video.play();
            if (playPromise !== undefined) {
              playPromise.catch(function () {
                // Autoplay prevented, fallback to poster
              });
            }
            videoObserver.unobserve(video);
          }
        });
      },
      { threshold: 0.1, rootMargin: '200px 0px' }
    );

    videos.forEach(function (video) {
      videoObserver.observe(video);
    });
  }

  /* ---------- PARALLAX EFFECT ON SCENES ---------- */
  function initParallax() {
    var scenes = document.querySelectorAll('.story-scene');

    function handleParallax() {
      scenes.forEach(function (scene) {
        var rect = scene.getBoundingClientRect();
        var viewH = window.innerHeight;
        if (rect.top < viewH && rect.bottom > 0) {
          var progress = (viewH - rect.top) / (viewH + rect.height);
          var offset = (progress - 0.5) * 30;
          var video = scene.querySelector('.scene-video');
          if (video) {
            video.style.transform = 'translate(-50%, calc(-50% + ' + offset + 'px))';
          }
        }
      });
    }

    window.addEventListener('scroll', handleParallax, { passive: true });
  }

  /* ---------- SCROLL INDICATOR HIDE ---------- */
  function initScrollIndicator() {
    var indicator = document.querySelector('.scroll-indicator');
    if (!indicator) return;

    window.addEventListener('scroll', function () {
      if (window.scrollY > 100) {
        indicator.style.opacity = '0';
        indicator.style.transition = 'opacity 0.5s';
      } else {
        indicator.style.opacity = '1';
      }
    }, { passive: true });
  }

  /* ---------- INIT ALL ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    initScrollProgress();
    initFadeIn();
    initKineticTypography();
    initCocktailCards();
    initDeck();
    initVideoLazyLoad();
    initParallax();
    initScrollIndicator();
  });
})();
