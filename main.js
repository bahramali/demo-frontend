const config = window.APP_CONFIG || {}
const rawBaseUrl = config.API_BASE_URL
const apiBaseUrl = rawBaseUrl && rawBaseUrl !== '__API_BASE_URL__' ? rawBaseUrl : ''

const nameInput = document.getElementById('name')
const personnelNumberInput = document.getElementById('personnelNumber')
const validationError = document.getElementById('validationError')
const submitButton = document.getElementById('submitButton')

const statusTitle = document.getElementById('statusTitle')
const statusText = document.getElementById('statusText')
const successMessage = document.getElementById('successMessage')
const errorMessage = document.getElementById('errorMessage')
const receivedName = document.getElementById('receivedName')
const receivedPersonnelNumber = document.getElementById('receivedPersonnelNumber')

const personnelNumberRegex = /^\d+$/

function isPersonnelNumberValid() {
  return personnelNumberRegex.test(personnelNumberInput.value)
}

function setStatus(status, text) {
  statusTitle.textContent = `Status: ${status}`
  statusText.textContent = text
}

function clearMessages() {
  successMessage.hidden = true
  errorMessage.hidden = true
  errorMessage.textContent = ''
}

function updateValidationState() {
  const value = personnelNumberInput.value
  const hasValue = value.length > 0
  const isValid = isPersonnelNumberValid()

  validationError.hidden = !hasValue || isValid
  submitButton.disabled = !isValid
}

async function handleSubmit() {
  if (!isPersonnelNumberValid()) {
    updateValidationState()
    return
  }

  if (!apiBaseUrl) {
    clearMessages()
    setStatus('error', 'Cannot send request.')
    errorMessage.hidden = false
    errorMessage.textContent = 'Missing API base URL. Set window.APP_CONFIG.API_BASE_URL in index.html.'
    return
  }

  clearMessages()
  submitButton.disabled = true
  setStatus('loading', 'Sending request to backend...')

  try {
    const response = await fetch(`${apiBaseUrl.replace(/\/$/, '')}/api/demo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: nameInput.value,
        personnelNumber: personnelNumberInput.value
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data?.message || `Request failed with status ${response.status}`)
    }

    receivedName.innerHTML = data.receivedName
    receivedPersonnelNumber.innerHTML = data.receivedPersonnelNumber
    successMessage.hidden = false
    setStatus('success', 'Request completed.')
  } catch (error) {
    setStatus('error', 'Request failed.')
    errorMessage.hidden = false
    errorMessage.textContent = error instanceof Error ? error.message : 'Unexpected request error'
  } finally {
    updateValidationState()
  }
}

personnelNumberInput.addEventListener('input', updateValidationState)
submitButton.addEventListener('click', handleSubmit)

updateValidationState()
