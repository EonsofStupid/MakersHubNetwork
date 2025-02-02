const splitTextIntoLetters = (element: HTMLElement) => {
  // Skip if already processed
  if (element.closest('.landing-letter-hover') || element.classList.contains('landing-letter-span')) {
    return;
  }
  
  const text = element.textContent || '';
  if (!text.trim()) return;
  
  // Create wrapper
  const wrapper = document.createElement('span');
  wrapper.className = 'landing-letter-hover';
  
  // Create spans for each letter
  const letters = text.split('').map((char, index) => {
    const span = document.createElement('span');
    span.textContent = char === ' ' ? '\u00A0' : char;
    span.className = 'landing-letter-span';
    span.style.setProperty('--letter-index', index.toString());
    return span;
  });
  
  // Clear and append
  element.textContent = '';
  letters.forEach(span => wrapper.appendChild(span));
  element.appendChild(wrapper);

  // Add mousemove handler
  wrapper.addEventListener('mousemove', (e) => {
    const rect = wrapper.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    
    letters.forEach((span, index) => {
      const spanRect = span.getBoundingClientRect();
      const spanCenter = spanRect.left + spanRect.width / 2 - rect.left;
      const distance = Math.abs(mouseX - spanCenter);
      
      if (distance < 30) {
        span.classList.add('active');
        const intensity = 1 - (distance / 30);
        span.style.setProperty('--intensity', intensity.toString());
      } else {
        span.classList.remove('active');
      }
    });
  });

  // Reset on mouse leave with transition
  wrapper.addEventListener('mouseleave', () => {
    letters.forEach((span, index) => {
      setTimeout(() => {
        span.classList.remove('active');
        span.style.removeProperty('--intensity');
      }, index * 50);
    });
  });
};

// Initialize on DOM content loaded
const initializeLetterEffects = () => {
  console.log('Initializing letter effects...');
  const selectors = [
    '.landing-title',
    '.landing-heading',
    '.landing-text',
    '[data-landing-text]'
  ].join(',');
  
  const elements = document.querySelectorAll(selectors);
  console.log('Found elements:', elements.length);
  
  elements.forEach(element => {
    if (element instanceof HTMLElement) {
      splitTextIntoLetters(element);
    }
  });
};

// Set up observers for dynamic content
const setupObservers = () => {
  console.log('Setting up text animation observers...');
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node instanceof HTMLElement) {
          const elements = node.querySelectorAll('.landing-title, .landing-heading, .landing-text, [data-landing-text]');
          elements.forEach(element => {
            if (element instanceof HTMLElement) {
              splitTextIntoLetters(element);
            }
          });
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  return () => observer.disconnect();
};

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM Content Loaded - Initializing text effects...');
  setTimeout(() => {
    initializeLetterEffects();
    setupObservers();
  }, 500);
});

export {};