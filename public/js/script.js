// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
      .forEach(function (form) {
        form.addEventListener('submit', function (event) {
          if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
          }
  
          form.classList.add('was-validated')
        }, false)
      })
  })()

  const revealItems = document.querySelectorAll('.reveal')

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' })

    revealItems.forEach((item) => revealObserver.observe(item))
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'))
  }

  document.querySelectorAll('.wander-toast').forEach((toast) => {
    const dismiss = () => {
      toast.classList.add('wander-toast-leaving')
      toast.addEventListener('transitionend', () => toast.remove(), { once: true })
      window.setTimeout(() => toast.remove(), 350)
    }

    toast.querySelector('.wander-toast-close').addEventListener('click', dismiss)

    if (toast.classList.contains('wander-toast-success')) {
      window.setTimeout(dismiss, 6000)
    }
  })

  const confirmModalElement = document.getElementById('wanderConfirmModal')

  if (confirmModalElement) {
    const confirmModal = bootstrap.Modal.getOrCreateInstance(confirmModalElement)
    const confirmTitle = document.getElementById('wanderConfirmTitle')
    const confirmMessage = document.getElementById('wanderConfirmMessage')
    const confirmSubmit = document.getElementById('wanderConfirmSubmit')
    let pendingForm = null

    document.addEventListener('submit', (event) => {
      const form = event.target

      if (!(form instanceof HTMLFormElement) || !form.hasAttribute('data-confirm')) {
        return
      }

      event.preventDefault()
      pendingForm = form
      confirmTitle.textContent = form.dataset.confirmTitle || 'Are you sure?'
      confirmMessage.textContent = form.dataset.confirmMessage || 'This action can’t be undone.'
      confirmSubmit.textContent = form.dataset.confirmAction || 'Yes, continue'
      confirmModal.show()
    })

    confirmSubmit.addEventListener('click', () => {
      if (!pendingForm) {
        return
      }

      const formToSubmit = pendingForm
      pendingForm = null
      confirmModal.hide()
      formToSubmit.submit()
    })

    confirmModalElement.addEventListener('hidden.bs.modal', () => {
      pendingForm = null
    })
  }