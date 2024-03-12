document.addEventListener('DOMContentLoaded', function() {
    const showInstructionsBtn = document.getElementById('showInstructionsBtn');
    const instructionsModal = document.getElementById('instructionsModal');
    const closeModal = instructionsModal.querySelector('.close');
  
    showInstructionsBtn.addEventListener('click', function() {
      instructionsModal.style.display = 'block';
    });
  
    closeModal.addEventListener('click', function() {
      instructionsModal.style.display = 'none';
    });
  
    window.addEventListener('click', function(event) {
      if (event.target === instructionsModal) {
        instructionsModal.style.display = 'none';
      }
    });
  });
  