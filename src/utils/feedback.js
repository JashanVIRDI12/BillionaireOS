// Visual feedback utility for enhanced user interactions
export const createRippleEffect = (element, color = 'rgba(139, 195, 74, 0.3)', event = null) => {
  const ripple = document.createElement('span');
  const rect = element.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event?.clientX - rect.left - size / 2 || 0;
  const y = event?.clientY - rect.top - size / 2 || 0;
  
  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = x + 'px';
  ripple.style.top = y + 'px';
  ripple.style.background = color;
  ripple.classList.add('ripple-effect');
  
  element.appendChild(ripple);
  
  setTimeout(() => {
    ripple.remove();
  }, 600);
};

export const addClickFeedback = (element, options = {}) => {
  const {
    scale = 0.95,
    duration = 150,
    ripple = true,
    rippleColor = 'rgba(139, 195, 74, 0.3)'
  } = options;
  
  element.addEventListener('mousedown', (e) => {
    element.style.transform = `scale(${scale})`;
    element.style.transition = `transform ${duration}ms ease-out`;
    
    if (ripple) {
      createRippleEffect(element, rippleColor);
    }
  });
  
  element.addEventListener('mouseup', () => {
    element.style.transform = 'scale(1)';
  });
  
  element.addEventListener('mouseleave', () => {
    element.style.transform = 'scale(1)';
  });
};

export const addHoverGlow = (element, glowColor = 'rgba(139, 195, 74, 0.2)') => {
  element.addEventListener('mouseenter', () => {
    element.style.boxShadow = `0 0 20px ${glowColor}`;
    element.style.transition = 'box-shadow 0.3s ease-out';
  });
  
  element.addEventListener('mouseleave', () => {
    element.style.boxShadow = '';
  });
};

export const triggerSuccessAnimation = (element) => {
  element.classList.add('success-pulse');
  element.style.filter = 'brightness(1.1)';
  
  setTimeout(() => {
    element.classList.remove('success-pulse');
    element.style.filter = '';
  }, 600);
};

export const triggerErrorShake = (element) => {
  element.classList.add('animate-shake');
  
  setTimeout(() => {
    element.classList.remove('animate-shake');
  }, 500);
};

export const addProgressCelebration = (progressBar, percentage) => {
  if (percentage === 100) {
    // Create sparkle effect
    const sparkles = document.createElement('div');
    sparkles.innerHTML = '<svg class="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>';
    sparkles.style.position = 'absolute';
    sparkles.style.top = '-10px';
    sparkles.style.right = '0px';
    sparkles.style.fontSize = '20px';
    sparkles.style.animation = 'sparkle 1s ease-out forwards';
    sparkles.style.pointerEvents = 'none';
    
    progressBar.parentElement.style.position = 'relative';
    progressBar.parentElement.appendChild(sparkles);
    
    setTimeout(() => {
      sparkles.remove();
    }, 600);
  }
};
