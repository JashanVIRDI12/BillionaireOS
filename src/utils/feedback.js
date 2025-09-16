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
    sparkles.innerHTML = '✨';
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
