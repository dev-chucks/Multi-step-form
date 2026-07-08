//State:
let currentStep = 1;
let isYearly = false;

//Element references:
const steps = document.querySelectorAll('.form-step');
const stepIndicators = document.querySelectorAll('.step-indicator .step');
const nextBtn = document.getElementById('nextBtn');
const backBtn = document.getElementById('backBtn');
const confirmBtn = document.getElementById('confirmBtn');
const billingToggle = document.getElementById('billingToggle');
const changePlanLink = document.getElementById('changePlanLink');

//Step navigation:
function goToStep(stepNumber) {
  steps.forEach(step => {
    step.classList.toggle('active', step.dataset.step == stepNumber);
  });

  stepIndicators.forEach(indicator => {
    indicator.classList.toggle('active', indicator.dataset.step == stepNumber);
  });

//Back button hidden on step 1:
  backBtn.classList.toggle('hidden', stepNumber === 1);

//Next shown on steps 1-3, Confirm shown on step 4, both hidden on step 5:
  nextBtn.classList.toggle('hidden', stepNumber === 4 || stepNumber === 5);
  confirmBtn.classList.toggle('hidden', stepNumber !== 4);

  currentStep = stepNumber;

  if (stepNumber === 4) {
    buildSummary();
  }
}

nextBtn.addEventListener('click', () => {
  if (!validateStep(currentStep)) return;
  goToStep(currentStep + 1);
});

backBtn.addEventListener('click', () => {
  goToStep(currentStep - 1);
});

confirmBtn.addEventListener('click', () => {
  goToStep(5);
});

changePlanLink.addEventListener('click', (e) => {
  e.preventDefault();
  goToStep(2);
});

//Validation:
function validateStep(stepNumber) {
  if (stepNumber === 1) {
    return validateStep1();
  }
  if (stepNumber === 2) {
    return validatePlanSelected();
  }

  return true;
}

function validateStep1() {
  const name = document.getElementById('name');
  const email = document.getElementById('email');
  const phone = document.getElementById('phone');

  let isValid = true;

  isValid = checkRequired(name, 'nameError') && isValid;
  isValid = checkEmail(email) && isValid;
  isValid = checkRequired(phone, 'phoneError') && isValid;

  return isValid;
}

function checkRequired(input, errorId) {
  const errorEl = document.getElementById(errorId);
  if (input.value.trim() === '') {
    input.classList.add('error');
    errorEl.classList.add('visible');
    return false;
  }
  input.classList.remove('error');
  errorEl.classList.remove('visible');
  return true;
}

function checkEmail(input) {
  const errorEl = document.getElementById('emailError');
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (input.value.trim() === '') {
    errorEl.textContent = 'This field is required';
    input.classList.add('error');
    errorEl.classList.add('visible');
    return false;
  }

  if (!emailPattern.test(input.value)) {
    errorEl.textContent = 'Please enter a valid email';
    input.classList.add('error');
    errorEl.classList.add('visible');
    return false;
  }

  input.classList.remove('error');
  errorEl.classList.remove('visible');
  return true;
}

function validatePlanSelected() {
  const selected = document.querySelector('input[name="plan"]:checked');
  return selected !== null;
// (You could add a visible warning here if you want a message
// when no plan is picked — the design doesn't specify one)
}

//Billing toggle:
billingToggle.addEventListener('change', () => {
  isYearly = billingToggle.checked;
  updatePlanPrices();
});

function updatePlanPrices() {
  document.querySelectorAll('.plan-card').forEach(card => {
    const input = card.querySelector('input');
    const priceEl = card.querySelector('.plan-price');
    const price = isYearly ? input.dataset.yearly : input.dataset.monthly;
    const period = isYearly ? '/yr' : '/mo';
    priceEl.textContent = `$${price}${period}`;
  });
}

//Summary building:
function buildSummary() {
  const selectedPlan = document.querySelector('input[name="plan"]:checked');
  const planNameEl = document.getElementById('summaryPlanName');
  const planPriceEl = document.getElementById('summaryPlanPrice');
  const billingPeriodEl = document.getElementById('summaryBillingPeriod');
  const addonsContainer = document.getElementById('summaryAddons');
  const totalPriceEl = document.getElementById('summaryTotalPrice');

  const period = isYearly ? 'yearly' : 'monthly';
  const suffix = isYearly ? '/yr' : '/mo';

// Plan name + price:
  const planName = selectedPlan.value;
  const planPrice = isYearly ? selectedPlan.dataset.yearly : selectedPlan.dataset.monthly;

  planNameEl.textContent = `${capitalize(planName)} (${period})`;
  planPriceEl.textContent = `$${planPrice}${suffix}`;
  billingPeriodEl.textContent = isYearly ? 'year' : 'month';

  let total = parseInt(planPrice);

// Add-ons:
  addonsContainer.innerHTML = '';
  const selectedAddons = document.querySelectorAll('input[name="addon"]:checked');

  selectedAddons.forEach(addon => {
    const addonPrice = isYearly ? addon.dataset.yearly : addon.dataset.monthly;
    total += parseInt(addonPrice);

    const row = document.createElement('div');
    row.classList.add('summary-addon-row');
    row.innerHTML = `
      <span>${capitalize(addon.value.replace(/-/g, ' '))}</span>
      <span>+$${addonPrice}${suffix}</span>
    `;
    addonsContainer.appendChild(row);
  });

  totalPriceEl.textContent = `+$${total}${suffix}`;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

goToStep(1);