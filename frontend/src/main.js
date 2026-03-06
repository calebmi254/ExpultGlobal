import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './style.css';

const app = document.querySelector('#app');
const heroImageUrl = new URL('../assets/images/created for website.png', import.meta.url).href;
const apiBaseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';

const services = [
  'Revenue Automation Systems',
  'AI Business Assistants',
  'Intelligent Website Systems',
  'Business Process Automation',
  'Custom Software Development',
  'Data & Intelligence Systems'
];

const solutions = [
  'For Service Businesses',
  'For Enterprise Teams',
  'For Founders'
];

const businessTypes = ['Car dealership', 'Restaurant', 'Online store', 'Real estate', 'Service business'];
const otherOptionValue = '__other__';
const experienceDraftStorageKey = 'expultExperienceDraftId';
const appointmentRequestSuccessMessage =
  'Appointment request has been triggered and one of our support team members will reach back shortly.';

const priorityOptions = [
  {
    label: 'More leads',
    description: 'Capture and qualify more demand automatically.'
  },
  {
    label: 'Faster follow-up',
    description: 'Respond while interest is still fresh and actionable.'
  },
  {
    label: 'Better operations',
    description: 'Reduce manual intake and route requests cleanly.'
  },
  {
    label: 'More bookings',
    description: 'Move visitors toward calls, appointments, and conversions.'
  }
];

const priorityLabels = priorityOptions.map(({ label }) => label);

const experienceWizardSteps = ['Your details', 'Business type', 'Growth priorities', 'Blueprint'];

let pendingContactPrefill = null;

const createInitialExperienceState = () => ({
  step: 1,
  draftId: '',
  name: '',
  email: '',
  businessName: '',
  businessTypeSelection: '',
  businessTypeCustom: '',
  prioritySelections: [],
  priorityCustom: '',
  blueprint: null,
  demoCountdownSeconds: 30,
  demoFlowComplete: false,
  returningFromFollowup: false,
  followupVisible: false,
  scheduleCallVisible: false,
  reconfirmedEmailInput: '',
  isRequestingAppointment: false,
  appointmentRequested: false,
  appointmentRequestMessage: '',
  appointmentRequestError: '',
  errorMessage: '',
  isSubmitting: false,
  isSavingDraft: false,
  isRestoringDraft: false
});

let experienceState = createInitialExperienceState();

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const getStoredExperienceDraftId = () => window.localStorage.getItem(experienceDraftStorageKey) || '';

const setStoredExperienceDraftId = (draftId) => {
  if (!draftId) {
    return;
  }

  window.localStorage.setItem(experienceDraftStorageKey, draftId);
};

const clearStoredExperienceDraftId = () => {
  window.localStorage.removeItem(experienceDraftStorageKey);
};

const getSelectedBusinessType = () =>
  experienceState.businessTypeSelection === otherOptionValue
    ? experienceState.businessTypeCustom.trim()
    : experienceState.businessTypeSelection;

const getDraftPriorities = (draft = {}) => {
  if (Array.isArray(draft.priorities) && draft.priorities.length) {
    return draft.priorities.map((priority) => String(priority || '').trim()).filter(Boolean);
  }

  if (typeof draft.priority === 'string' && draft.priority.trim()) {
    return draft.priority
      .split(',')
      .map((priority) => priority.trim())
      .filter(Boolean);
  }

  return [];
};

const getSelectedPriorities = () => {
  const selectedValues = Array.isArray(experienceState.prioritySelections)
    ? experienceState.prioritySelections
    : [];
  const priorities = selectedValues.filter((value) => value && value !== otherOptionValue);
  const customPriority = experienceState.priorityCustom.trim();

  if (selectedValues.includes(otherOptionValue) && customPriority) {
    priorities.push(customPriority);
  }

  return Array.from(new Set(priorities));
};

const getPrioritySummary = () => getSelectedPriorities().join(', ');

const isUsingCustomBusinessType = () => experienceState.businessTypeSelection === otherOptionValue;

const isUsingCustomPriority = () =>
  Array.isArray(experienceState.prioritySelections) && experienceState.prioritySelections.includes(otherOptionValue);

const getStepFromDraft = (draft) => {
  if (draft.blueprint) {
    return 4;
  }

  if (getDraftPriorities(draft).length) {
    return 3;
  }

  if (draft.businessType) {
    return 3;
  }

  if (draft.name && draft.email && draft.businessName) {
    return 2;
  }

  return 1;
};

const hydrateExperienceStateFromDraft = (draft) => {
  const businessType = draft.businessType || '';
  const priorities = getDraftPriorities(draft);
  const hasPresetBusinessType = businessTypes.includes(businessType);
  const presetPriorities = priorities.filter((priority) => priorityLabels.includes(priority));
  const customPriorities = priorities.filter((priority) => !priorityLabels.includes(priority));
  const customPriority = customPriorities.join(', ');

  return {
    ...createInitialExperienceState(),
    draftId: draft.draftId || '',
    name: draft.name || '',
    email: draft.email || '',
    businessName: draft.businessName || '',
    businessTypeSelection: hasPresetBusinessType ? businessType : businessType ? otherOptionValue : '',
    businessTypeCustom: hasPresetBusinessType ? '' : businessType,
    prioritySelections: [...presetPriorities, ...(customPriority ? [otherOptionValue] : [])],
    priorityCustom: customPriority,
    blueprint: draft.blueprint || null,
    demoCountdownSeconds: 30,
    demoFlowComplete: Boolean(draft.blueprint),
    returningFromFollowup: false,
    followupVisible: false,
    scheduleCallVisible: Boolean(draft.hotLead),
    reconfirmedEmailInput: draft.reenteredEmail || draft.reconfirmedEmail || draft.confirmedContactEmail || '',
    isRequestingAppointment: false,
    appointmentRequested: Boolean(draft.hotLead),
    appointmentRequestMessage: draft.hotLead ? appointmentRequestSuccessMessage : '',
    appointmentRequestError: '',
    errorMessage: '',
    isSubmitting: false,
    isSavingDraft: false,
    isRestoringDraft: false,
    step: getStepFromDraft(draft)
  };
};

const parseApiResponse = async (response, fallbackMessage) => {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || fallbackMessage);
  }

  return data;
};

const createExperienceDraft = async (payload) => {
  const response = await fetch(`${apiBaseUrl}/api/automation-test-drive/draft`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const data = await parseApiResponse(response, 'We could not save your details right now.');
  return data.draft;
};

const updateExperienceDraft = async (draftId, payload) => {
  const response = await fetch(`${apiBaseUrl}/api/automation-test-drive/draft/${draftId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const data = await parseApiResponse(response, 'We could not update your saved draft right now.');
  return data.draft;
};

const fetchExperienceDraft = async (draftId) => {
  const response = await fetch(`${apiBaseUrl}/api/automation-test-drive/draft/${draftId}`);
  const data = await parseApiResponse(response, 'We could not restore your saved draft right now.');
  return data.draft;
};

const renderDropdownItems = (items, type) => {
  const targetModal = type === 'service' ? 'experienceModal' : 'contactModal';

  return items
    .map(
      (item) => `
        <li>
          <button
            class="dropdown-item"
            type="button"
            data-bs-toggle="modal"
            data-bs-target="#${targetModal}"
            ${type === 'solution' ? `data-team-type="${item}"` : ''}
          >
            ${item}
          </button>
        </li>
      `
    )
    .join('');
};

const getProgressMeta = () => {
  if (experienceState.step === 1) {
    return { label: 'Step 1 of 4', title: 'Your details', width: '25%' };
  }

  if (experienceState.step === 2) {
    return { label: 'Step 2 of 4', title: 'Business type', width: '50%' };
  }

  if (experienceState.step === 3) {
    return { label: 'Step 3 of 4', title: 'Growth priority', width: '75%' };
  }

  if (experienceState.step === 4) {
    return experienceState.isSubmitting
      ? { label: 'Step 4 of 4', title: 'Generating blueprint', width: '100%' }
      : { label: 'Step 4 of 4', title: 'Your automation blueprint', width: '100%' };
  }

  return { label: 'Step 4 of 4', title: 'Your automation blueprint', width: '100%' };
};

const getActiveWizardStep = () => {
  if (experienceState.step >= 1 && experienceState.step <= experienceWizardSteps.length) {
    return experienceState.step;
  }

  return experienceWizardSteps.length;
};

const renderProgressSteps = () => {
  const activeStep = getActiveWizardStep();

  return experienceWizardSteps
    .map((stepTitle, index) => {
      const stepNumber = index + 1;
      const stateClass =
        stepNumber < activeStep ? 'complete' : stepNumber === activeStep ? 'active' : 'upcoming';

      return `
        <span class="wizard-step-pill ${stateClass}">
          <span class="wizard-step-count">0${stepNumber}</span>
          <span>${escapeHtml(stepTitle)}</span>
        </span>
      `;
    })
    .join('');
};

const renderSelectionChips = () => {
  const chips = [];
  const selectedBusinessType = getSelectedBusinessType();
  const selectedPriorities = getSelectedPriorities();

  if (experienceState.businessName) {
    chips.push(`<span class="selection-chip">${escapeHtml(experienceState.businessName)}</span>`);
  }

  if (selectedBusinessType) {
    chips.push(`<span class="selection-chip">${escapeHtml(selectedBusinessType)}</span>`);
  }

  selectedPriorities.forEach((priority) => {
    chips.push(`<span class="selection-chip">${escapeHtml(priority)}</span>`);
  });

  return chips.length ? `<div class="selection-chip-row">${chips.join('')}</div>` : '';
};

const renderExperienceActions = ({ left = '', right = '' } = {}) => `
  <div class="experience-actions">
    <div class="experience-actions-side">${left}</div>
    <div class="experience-actions-side experience-actions-side-right">${right}</div>
  </div>
`;

const renderExperienceFollowup = () => {
  const followupHost = document.querySelector('#experienceFollowupHost');

  if (!followupHost) {
    return;
  }

  if (!experienceState.followupVisible || !experienceState.blueprint) {
    followupHost.innerHTML = '';
    return;
  }

  const showCompletionOnly = experienceState.appointmentRequested;

  followupHost.innerHTML = `
    <div class="experience-followup-panel" role="status">
      <div class="experience-followup-copy">
        <span class="experience-kicker">Demo complete</span>
        <h3>You just experienced a demo revenue automation workflow for Expult.</h3>
        <p>
          The system moved you from a visitor to a potential customer inside a guided automation journey built to demonstrate how Expult captures, qualifies, and advances demand.
        </p>
      </div>

      <div class="experience-followup-actions">
        ${
          showCompletionOnly
            ? '<button class="btn btn-primary-glow" type="button" data-followup-action="complete-followup">Complete</button>'
            : `
                <button class="btn btn-ghost" type="button" data-followup-action="reopen-blueprint">Back to your blueprint</button>
                <button class="btn btn-primary-glow" type="button" data-followup-action="toggle-schedule">Schedule a call with us</button>
              `
        }
      </div>

      ${
        experienceState.scheduleCallVisible && !showCompletionOnly
          ? `
            <form class="experience-followup-form" id="experienceFollowupForm" novalidate>
              <label class="form-label" for="experienceReconfirmedEmail">Re-enter your email</label>
              <div class="experience-followup-input-row">
                <input
                  class="form-control"
                  id="experienceReconfirmedEmail"
                  name="email"
                  type="email"
                  value="${escapeHtml(experienceState.reconfirmedEmailInput)}"
                  placeholder="re-enter your email"
                  ${experienceState.isRequestingAppointment ? 'disabled' : ''}
                  required
                />
                <button class="btn btn-primary-glow" type="submit" ${experienceState.isRequestingAppointment ? 'disabled' : ''}>
                  ${experienceState.isRequestingAppointment ? 'Confirming...' : 'Confirm appointment request'}
                </button>
              </div>
            </form>
          `
          : ''
      }

      ${
        showCompletionOnly && experienceState.appointmentRequestMessage
          ? `<div class="alert alert-success mb-0">${escapeHtml(experienceState.appointmentRequestMessage)}</div>`
          : ''
      }
      ${
        experienceState.appointmentRequestError
          ? `<div class="alert alert-warning mb-0">${escapeHtml(experienceState.appointmentRequestError)}</div>`
          : ''
      }
    </div>
  `;
};

const renderInlineOtherOption = ({
  selected,
  dataAttribute,
  hint,
  inputId,
  inputLabel,
  inputValue,
  placeholder,
  wrapperClass = ''
}) => `
  <div class="choice-inline-option ${wrapperClass} ${selected ? 'selected' : ''}">
    <button
      class="choice-card choice-card-detail choice-card-compact choice-inline-trigger ${selected ? 'selected' : ''}"
      type="button"
      ${dataAttribute}="${otherOptionValue}"
    >
      <strong>Other</strong>
      <span>Custom option</span>
    </button>
    <div class="choice-inline-body">
      ${
        selected
          ? `
            <label class="choice-inline-label" for="${inputId}">${escapeHtml(inputLabel)}</label>
            <input
              class="form-control"
              id="${inputId}"
              type="text"
              value="${escapeHtml(inputValue)}"
              placeholder="${escapeHtml(placeholder)}"
            />
          `
          : `<span class="choice-inline-hint">${escapeHtml(hint)}</span>`
      }
    </div>
  </div>
`;

const renderExperienceWizard = () => {
  const wizard = document.querySelector('#experienceWizard');
  const feedback = document.querySelector('#experienceFeedback');
  const progressBar = document.querySelector('#experienceProgressBar');
  const progressLabel = document.querySelector('#experienceProgressLabel');
  const progressTitle = document.querySelector('#experienceProgressTitle');
  const progressSteps = document.querySelector('#experienceProgressSteps');

  if (!wizard || !feedback || !progressBar || !progressLabel || !progressTitle || !progressSteps) {
    return;
  }

  const progressMeta = getProgressMeta();

  progressBar.style.width = progressMeta.width;
  progressLabel.textContent = progressMeta.label;
  progressTitle.textContent = progressMeta.title;
  progressSteps.innerHTML = renderProgressSteps();
  feedback.innerHTML = experienceState.errorMessage
    ? `<div class="alert alert-warning mb-0">${escapeHtml(experienceState.errorMessage)}</div>`
    : '';

  if (experienceState.isRestoringDraft) {
    wizard.innerHTML = `
      <section class="experience-stage loading-stage">
        <div class="loading-panel">
          <div class="loading-orb"></div>
          <h3>Restoring your saved progress...</h3>
          <p>Loading your details and previous selections from the backend.</p>
        </div>
      </section>
    `;

    return;
  }

  if (experienceState.step === 1) {
    wizard.innerHTML = `
      <section class="experience-stage">
        <div class="experience-stage-hero compact">
          <h3>Where should we send your blueprint?</h3>
          <p>Start with your details so Expult can personalize the experience from the first step.</p>
        </div>

        <form id="experienceDetailsForm" class="experience-form" novalidate>
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label" for="experienceName">Name</label>
              <input class="form-control" id="experienceName" name="name" type="text" value="${escapeHtml(experienceState.name)}" placeholder="Your name" required />
            </div>
            <div class="col-md-6">
              <label class="form-label" for="experienceEmail">Email</label>
              <input class="form-control" id="experienceEmail" name="email" type="email" value="${escapeHtml(experienceState.email)}" placeholder="you@company.com" required />
            </div>
            <div class="col-12">
              <label class="form-label" for="experienceBusinessName">Business name</label>
              <input class="form-control" id="experienceBusinessName" name="businessName" type="text" value="${escapeHtml(experienceState.businessName)}" placeholder="Your business or brand" required />
            </div>
          </div>

          <div class="mt-4">
            ${renderExperienceActions({
              left: '<button class="btn btn-ghost" type="button" data-bs-dismiss="modal">Close</button>',
              right: `<button class="btn btn-primary-glow" type="submit" ${experienceState.isSavingDraft ? 'disabled' : ''}>${
                experienceState.isSavingDraft ? 'Saving...' : 'Next'
              }</button>`
            })}
          </div>
        </form>
      </section>
    `;

    return;
  }

  if (experienceState.step === 2) {
    wizard.innerHTML = `
      <section class="experience-stage">
        ${renderSelectionChips()}
        <div class="experience-stage-hero compact">
          <h3>What kind of business are we designing for?</h3>
          <p>Choose the business model this revenue automation flow should reflect.</p>
        </div>
        <div class="choice-grid business-type-grid">
          ${businessTypes
            .map(
              (businessType) => `
                <button
                  class="choice-card choice-card-compact ${experienceState.businessTypeSelection === businessType ? 'selected' : ''}"
                  type="button"
                  data-business-type="${escapeHtml(businessType)}"
                >
                  <strong>${escapeHtml(businessType)}</strong>
                </button>
              `
            )
            .join('')}
          ${renderInlineOtherOption({
            selected: isUsingCustomBusinessType(),
            dataAttribute: 'data-business-type',
            hint: 'Add the business model Expult should design the system around.',
            inputId: 'experienceBusinessTypeOther',
            inputLabel: 'Your business type',
            inputValue: experienceState.businessTypeCustom,
            placeholder: 'Example: Logistics company',
            wrapperClass: 'business-type-inline-option'
          })}
        </div>
        ${renderExperienceActions({
          left: '<button class="btn btn-ghost" type="button" data-step-action="back-to-details">Back</button>',
          right: `<button class="btn btn-primary-glow" type="button" data-step-action="next-to-priority" ${
            getSelectedBusinessType() ? '' : 'disabled'
          }>Next</button>`
        })}
      </section>
    `;

    return;
  }

  if (experienceState.step === 3) {
    wizard.innerHTML = `
      <section class="experience-stage">
        ${renderSelectionChips()}
        <div class="experience-stage-hero compact">
          <h3>What matters most right now?</h3>
          <p>Choose one or more revenue or operational priorities Expult should emphasize in your automation blueprint.</p>
        </div>
        <div class="choice-grid priority-grid">
          ${priorityOptions
            .map(
              (priority) => `
                <button
                  class="choice-card choice-card-detail choice-card-compact ${getSelectedPriorities().includes(priority.label) ? 'selected' : ''}"
                  type="button"
                  data-priority="${escapeHtml(priority.label)}"
                >
                  <strong>${escapeHtml(priority.label)}</strong>
                  <span>${escapeHtml(priority.description)}</span>
                </button>
              `
            )
            .join('')}
          ${renderInlineOtherOption({
            selected: isUsingCustomPriority(),
            dataAttribute: 'data-priority',
            hint: 'Add the exact growth or workflow priority Expult should solve first.',
            inputId: 'experiencePriorityOther',
            inputLabel: 'Your priority',
            inputValue: experienceState.priorityCustom,
            placeholder: 'Example: Reduce missed follow-ups',
            wrapperClass: 'priority-inline-option'
          })}
        </div>
        ${renderExperienceActions({
          left: '<button class="btn btn-ghost" type="button" data-step-action="back-to-business">Back</button>',
          right: `<button class="btn btn-primary-glow" type="button" data-step-action="generate-blueprint" ${
            getSelectedPriorities().length || experienceState.isSubmitting ? '' : 'disabled'
          }>${experienceState.isSubmitting ? 'Generating...' : 'Generate My Blueprint'}</button>`
        })}
      </section>
    `;

    return;
  }

  if (experienceState.step === 4 && experienceState.isSubmitting) {
    wizard.innerHTML = `
      <section class="experience-stage loading-stage">
        ${renderSelectionChips()}
        <div class="loading-panel">
          <div class="loading-orb"></div>
          <h3>Generating your automation blueprint...</h3>
          <p>
            Saving your lead and shaping a revenue automation blueprint Expult can realistically build for your team.
          </p>
          <div class="loading-list">
            <span>Lead saved</span>
            <span>Revenue flow mapped</span>
            <span>Groq blueprint generated</span>
          </div>
        </div>
      </section>
    `;

    return;
  }

  const blueprint = experienceState.blueprint;

  wizard.innerHTML = `
    <section class="experience-stage result-stage">
      ${renderSelectionChips()}
      <div class="result-hero compact">
        <span class="experience-kicker">Blueprint ready</span>
        <h3>${escapeHtml(blueprint.title)}</h3>
        <p class="result-headline">${escapeHtml(blueprint.headline)}</p>
        <p>${escapeHtml(blueprint.summary)}</p>
      </div>

      <div class="result-overview-grid">
        <article class="result-overview-card">
          <span class="result-overview-label">Prepared for</span>
          <strong>${escapeHtml(experienceState.businessName)}</strong>
        </article>
        <article class="result-overview-card">
          <span class="result-overview-label">Business type</span>
          <strong>${escapeHtml(getSelectedBusinessType())}</strong>
        </article>
        <article class="result-overview-card">
          <span class="result-overview-label">Growth priorities</span>
          <strong>${escapeHtml(getPrioritySummary())}</strong>
        </article>
      </div>

      <div class="result-panel-grid">
        <div class="result-highlight">
          <strong>Primary outcome</strong>
          <p>${escapeHtml(blueprint.outcome)}</p>
        </div>
        <div class="result-next-action">
          <strong>What Expult would build next</strong>
          <p>${escapeHtml(blueprint.nextAction)}</p>
        </div>
      </div>

      <div class="blueprint-flow-grid result-flow-grid">
        ${blueprint.steps
          .map(
            (step, index) => `
              <article class="blueprint-step-card">
                <div class="blueprint-step-head">
                  <span class="experience-step-number">0${index + 1}</span>
                  <h4>${escapeHtml(step.title)}</h4>
                </div>
                <p>${escapeHtml(step.copy)}</p>
              </article>
            `
          )
          .join('')}
      </div>

      ${renderExperienceActions({
        left: '<button class="btn btn-ghost" type="button" data-step-action="restart-test-drive">Run It Again</button>',
        right: experienceState.returningFromFollowup
          ? '<button class="btn btn-primary-glow" type="button" data-step-action="finish-demo">Finish</button>'
          : `
              <button class="demo-complete-card demo-complete-card-button" type="button" data-step-action="open-followup-now" aria-live="polite">
                <span class="result-overview-label">Demo Complete</span>
                <strong>${
                  experienceState.demoFlowComplete
                    ? 'Workflow complete'
                    : `Closing in ${experienceState.demoCountdownSeconds}s`
                }</strong>
                <p>${
                  experienceState.demoFlowComplete
                    ? 'Click to return to your follow-up action panel.'
                    : 'Wait 30 seconds or click now to continue to your next action.'
                }</p>
              </button>
            `
      })}
    </section>
  `;
};

const renderApp = () => {
  app.innerHTML = `
    <div class="site-shell">
      <header class="site-header">
        <nav class="navbar navbar-expand-lg navbar-dark">
          <div class="container">
            <a class="navbar-brand" href="#home">Expult Global</a>
            <button
              class="navbar-toggler border-0 shadow-none"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#primaryNav"
              aria-controls="primaryNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="primaryNav">
              <ul class="navbar-nav mx-auto align-items-lg-center gap-lg-2">
                <li class="nav-item"><a class="nav-link active" href="#home">Home</a></li>
                <li class="nav-item dropdown">
                  <button class="nav-link dropdown-toggle btn btn-link" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Services
                  </button>
                  <ul class="dropdown-menu dropdown-menu-dark border-0 shadow-lg rounded-4 p-2">
                    ${renderDropdownItems(services, 'service')}
                  </ul>
                </li>
                <li class="nav-item dropdown">
                  <button class="nav-link dropdown-toggle btn btn-link" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Solutions
                  </button>
                  <ul class="dropdown-menu dropdown-menu-dark border-0 shadow-lg rounded-4 p-2">
                    ${renderDropdownItems(solutions, 'solution')}
                  </ul>
                </li>
                <li class="nav-item"><a class="nav-link" href="#home">About</a></li>
                <li class="nav-item">
                  <button class="nav-link btn btn-link" type="button" data-bs-toggle="modal" data-bs-target="#contactModal">
                    Contact
                  </button>
                </li>
              </ul>

              <button class="btn btn-contact ms-lg-3" type="button" data-bs-toggle="modal" data-bs-target="#contactModal">
                Talk to Us
              </button>
            </div>
          </div>
        </nav>
      </header>

      <main id="home" class="hero-section" style="--hero-image: url('${heroImageUrl}')">
        <div class="hero-background-overlay"></div>
        <div class="container hero-content">
          <div class="row align-items-center">
            <div class="col-lg-7 col-xl-6">
              <div class="hero-copy">
                <span class="hero-eyebrow">Revenue Automation Systems</span>
                <h1>Build Revenue Systems That Capture, Qualify, and Convert</h1>
                <p class="hero-lead">
                  Expult Global helps businesses capture customers, automate operations, understand demand, and build a complete revenue automation ecosystem.
                </p>

                <div class="hero-actions d-flex flex-column flex-sm-row gap-3">
                  <button class="btn btn-primary-glow" type="button" data-bs-toggle="modal" data-bs-target="#experienceModal">
                    Experience Revenue Automation
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <div class="modal fade" id="contactModal" tabindex="-1" aria-labelledby="contactModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content contact-modal">
          <div class="modal-header modal-header-centered border-0 pb-0">
            <div class="modal-header-copy">
              <span class="modal-eyebrow">Expult Global</span>
              <h2 class="modal-title" id="contactModalLabel">Start Your Automation Conversation</h2>
              <p class="modal-subcopy mb-0">
                Tell us what you want to automate and we will follow up with the right next step for your team.
              </p>
            </div>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body pt-4">
            <div id="contactFeedback" class="mb-3"></div>

            <form id="contactForm" class="contact-form-shell" novalidate>
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label" for="name">Name</label>
                  <input class="form-control" id="name" name="name" type="text" placeholder="Your name" required />
                </div>
                <div class="col-md-6">
                  <label class="form-label" for="email">Email</label>
                  <input class="form-control" id="email" name="email" type="email" placeholder="you@company.com" required />
                </div>
                <div class="col-md-6">
                  <label class="form-label" for="company">Company</label>
                  <input class="form-control" id="company" name="company" type="text" placeholder="Company or brand" required />
                </div>
                <div class="col-md-6">
                  <label class="form-label" for="teamType">Team Type</label>
                  <select class="form-select" id="teamType" name="teamType" required>
                    <option value="">Select your team</option>
                    <option>Service Businesses</option>
                    <option>Enterprise Teams</option>
                    <option>Founders</option>
                    <option>General Inquiry</option>
                  </select>
                </div>
                <div class="col-12">
                  <label class="form-label" for="message">What do you want to automate?</label>
                  <textarea class="form-control" id="message" name="message" rows="4" placeholder="Describe the revenue or operations challenge you want Expult Global to solve." required></textarea>
                </div>
              </div>

              <div class="experience-actions modal-actions mt-4">
                <div class="experience-actions-side">
                  <button class="btn btn-ghost" id="contactCloseButton" type="button" data-bs-dismiss="modal">Close</button>
                </div>
                <div class="experience-actions-side experience-actions-side-right">
                  <button class="btn btn-primary-glow" id="contactSubmitButton" type="submit">Send Request</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="experienceModal" tabindex="-1" aria-labelledby="experienceModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg experience-modal-dialog">
        <div class="modal-content experience-modal">
          <div class="modal-header border-0 pb-0 experience-modal-header modal-header-centered">
            <div class="modal-header-copy w-100">
              <span class="modal-eyebrow">Expult Automation Test Drive</span>
              <div class="wizard-progress-header">
                <span class="wizard-progress-label" id="experienceProgressLabel">Step 1 of 4</span>
                <h2 class="wizard-progress-title" id="experienceProgressTitle">Your details</h2>
              </div>
              <div class="wizard-progress-track" aria-hidden="true">
                <span id="experienceProgressBar"></span>
              </div>
              <div class="wizard-progress-steps" id="experienceProgressSteps" aria-hidden="true"></div>
              <h2 class="visually-hidden" id="experienceModalLabel">Expult Automation Test Drive</h2>
            </div>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body pt-3">
            <div id="experienceFeedback" class="mb-3"></div>
            <div id="experienceWizard"></div>
          </div>
        </div>
      </div>
    </div>

    <div id="experienceFollowupHost" class="experience-followup-host" aria-live="polite"></div>
    <button
      class="d-none"
      id="experienceModalReopenTrigger"
      type="button"
      data-bs-toggle="modal"
      data-bs-target="#experienceModal"
      tabindex="-1"
      aria-hidden="true"
    ></button>
  `;
};

const initializeContactForm = () => {
  const contactForm = document.querySelector('#contactForm');
  const contactFeedback = document.querySelector('#contactFeedback');
  const contactSubmitButton = document.querySelector('#contactSubmitButton');
  const contactCloseButton = document.querySelector('#contactCloseButton');
  const teamTypeField = document.querySelector('#teamType');
  const contactModal = document.querySelector('#contactModal');
  const nameField = document.querySelector('#name');
  const emailField = document.querySelector('#email');
  const companyField = document.querySelector('#company');
  const messageField = document.querySelector('#message');
  let contactCloseTimer = null;

  const applyTeamType = (label) => {
    if (label?.includes('Service')) {
      teamTypeField.value = 'Service Businesses';
    } else if (label?.includes('Enterprise')) {
      teamTypeField.value = 'Enterprise Teams';
    } else if (label?.includes('Founder')) {
      teamTypeField.value = 'Founders';
    } else {
      teamTypeField.value = 'General Inquiry';
    }
  };

  document.querySelectorAll('[data-team-type]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      applyTeamType(trigger.getAttribute('data-team-type'));
    });
  });

  contactModal.addEventListener('show.bs.modal', (event) => {
    if (contactCloseTimer) {
      window.clearTimeout(contactCloseTimer);
      contactCloseTimer = null;
    }

    const trigger = event.relatedTarget;
    const teamTypeLabel = trigger?.getAttribute('data-team-type');

    contactFeedback.innerHTML = '';

    if (teamTypeLabel) {
      applyTeamType(teamTypeLabel);
    }

    if (pendingContactPrefill) {
      nameField.value = pendingContactPrefill.name || '';
      emailField.value = pendingContactPrefill.email || '';
      companyField.value = pendingContactPrefill.company || '';
      teamTypeField.value = pendingContactPrefill.teamType || 'General Inquiry';
      messageField.value = pendingContactPrefill.message || '';
      pendingContactPrefill = null;
    }
  });

  contactModal.addEventListener('hidden.bs.modal', () => {
    if (contactCloseTimer) {
      window.clearTimeout(contactCloseTimer);
      contactCloseTimer = null;
    }

    contactFeedback.innerHTML = '';
  });

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!contactForm.checkValidity()) {
      contactForm.classList.add('was-validated');
      return;
    }

    const formData = new FormData(contactForm);
    const payload = Object.fromEntries(formData.entries());

    contactSubmitButton.disabled = true;
    contactSubmitButton.textContent = 'Sending...';
    contactFeedback.innerHTML = '';

    try {
      const response = await fetch(`${apiBaseUrl}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to send your request right now.');
      }

      contactFeedback.innerHTML = `<div class="alert alert-success mb-0">${data.message}</div>`;
      contactForm.reset();
      contactForm.classList.remove('was-validated');

      contactCloseTimer = window.setTimeout(() => {
        contactCloseButton?.click();
      }, 1200);
    } catch (error) {
      contactFeedback.innerHTML = `
        <div class="alert alert-warning mb-0">
          ${error.message || 'Backend is not reachable yet. Start npm run dev from the root folder.'}
        </div>
      `;
    } finally {
      contactSubmitButton.disabled = false;
      contactSubmitButton.textContent = 'Send Request';
    }
  });
};

const initializeExperienceModal = () => {
  const experienceWizard = document.querySelector('#experienceWizard');
  const experienceModal = document.querySelector('#experienceModal');
  const followupHost = document.querySelector('#experienceFollowupHost');
  const reopenTrigger = document.querySelector('#experienceModalReopenTrigger');
  let experienceCountdownTimer = null;

  if (!experienceWizard || !experienceModal || !followupHost || !reopenTrigger) {
    return;
  }

  function syncExperienceActionState() {
    const nextToPriorityButton = experienceWizard.querySelector('[data-step-action="next-to-priority"]');
    const generateBlueprintButton = experienceWizard.querySelector('[data-step-action="generate-blueprint"]');

    if (nextToPriorityButton) {
      nextToPriorityButton.disabled = !getSelectedBusinessType();
    }

    if (generateBlueprintButton) {
      generateBlueprintButton.disabled = !getSelectedPriorities().length || experienceState.isSubmitting;
    }
  }

  function stopDemoCountdown() {
    if (experienceCountdownTimer) {
      window.clearInterval(experienceCountdownTimer);
      experienceCountdownTimer = null;
    }
  }

  function dismissExperienceModal() {
    const dismissTrigger = experienceModal.querySelector('[data-bs-dismiss="modal"]');
    dismissTrigger?.click();
  }

  function resetExperienceDemo() {
    clearStoredExperienceDraftId();
    stopDemoCountdown();
    experienceState = createInitialExperienceState();
    refreshExperienceUI();
  }

  function refreshExperienceUI() {
    renderExperienceWizard();
    renderExperienceFollowup();
    syncExperienceActionState();
    syncDemoCountdown();
  }

  function completeDemoFlow() {
    stopDemoCountdown();

    if (!experienceState.blueprint) {
      return;
    }

    experienceState = {
      ...experienceState,
      demoCountdownSeconds: 0,
      demoFlowComplete: true,
      followupVisible: true
    };
    refreshExperienceUI();

    dismissExperienceModal();
  }

  function syncDemoCountdown() {
    if (!(experienceState.step === 4 && experienceState.blueprint && !experienceState.isSubmitting && !experienceState.demoFlowComplete)) {
      stopDemoCountdown();
      return;
    }

    if (experienceCountdownTimer) {
      return;
    }

    experienceCountdownTimer = window.setInterval(() => {
      if (experienceState.demoCountdownSeconds <= 1) {
        completeDemoFlow();
        return;
      }

      experienceState = {
        ...experienceState,
        demoCountdownSeconds: experienceState.demoCountdownSeconds - 1
      };
      refreshExperienceUI();
    }, 1000);
  }

  refreshExperienceUI();

  const focusWizardInput = (selector) => {
    window.requestAnimationFrame(() => {
      const input = experienceWizard.querySelector(selector);

      if (input) {
        input.focus();
        input.select();
      }
    });
  };

  const persistDraftProgress = async (payload, { silent = false } = {}) => {
    if (!experienceState.draftId || !Object.keys(payload).length) {
      return null;
    }

    try {
      const updatedDraft = await updateExperienceDraft(experienceState.draftId, payload);
      setStoredExperienceDraftId(updatedDraft.draftId);
      return updatedDraft;
    } catch (error) {
      if (!silent) {
        throw error;
      }

      console.warn('Unable to persist automation draft progress.', error);
      return null;
    }
  };

  const restoreDraftFromStorage = async () => {
    const storedDraftId = getStoredExperienceDraftId();

    if (!storedDraftId) {
      return;
    }

    if (
      storedDraftId === experienceState.draftId &&
      (experienceState.name || experienceState.blueprint || getSelectedBusinessType() || getSelectedPriorities().length)
    ) {
      return;
    }

    experienceState = {
      ...createInitialExperienceState(),
      draftId: storedDraftId,
      isRestoringDraft: true
    };
    refreshExperienceUI();

    try {
      const savedDraft = await fetchExperienceDraft(storedDraftId);
      experienceState = hydrateExperienceStateFromDraft(savedDraft);
      refreshExperienceUI();
    } catch (error) {
      clearStoredExperienceDraftId();
      experienceState = {
        ...createInitialExperienceState(),
        errorMessage: error.message || 'We could not restore your saved draft right now.'
      };
      refreshExperienceUI();
    }
  };

  const submitExperienceBlueprint = async () => {
    const businessType = getSelectedBusinessType();
    const priorities = getSelectedPriorities();
    const priority = priorities.join(', ');
    const payload = {
      draftId: experienceState.draftId,
      businessType,
      priorities,
      priority,
      name: experienceState.name,
      email: experienceState.email,
      businessName: experienceState.businessName
    };

    if (!payload.name || !payload.email || !payload.businessName || !payload.businessType || !payload.priorities.length) {
      experienceState.errorMessage = 'Please complete each step before generating your blueprint.';
      refreshExperienceUI();
      return;
    }

    experienceState = {
      ...experienceState,
      errorMessage: '',
      isSubmitting: true,
      blueprint: null,
      step: 4
    };
    refreshExperienceUI();

    try {
      await persistDraftProgress(
        {
          businessType,
          priorities
        },
        { silent: true }
      );

      const response = await fetch(`${apiBaseUrl}/api/automation-test-drive`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await parseApiResponse(response, 'We could not generate your automation blueprint right now.');

      if (data.draftId) {
        setStoredExperienceDraftId(data.draftId);
      }

      experienceState = {
        ...experienceState,
        draftId: data.draftId || experienceState.draftId,
        blueprint: data.blueprint,
        demoCountdownSeconds: 30,
        demoFlowComplete: false,
        returningFromFollowup: false,
        followupVisible: false,
        scheduleCallVisible: false,
        reconfirmedEmailInput: '',
        isRequestingAppointment: false,
        appointmentRequested: false,
        appointmentRequestMessage: '',
        appointmentRequestError: '',
        isSubmitting: false,
        step: 4
      };
      refreshExperienceUI();
    } catch (error) {
      experienceState = {
        ...experienceState,
        isSubmitting: false,
        step: 3,
        errorMessage: error.message || 'Backend is not reachable yet. Start npm run dev from the root folder.'
      };
      refreshExperienceUI();
    }
  };

  experienceWizard.addEventListener('click', async (event) => {
    const actionTrigger = event.target.closest('[data-step-action]');
    const businessTrigger = event.target.closest('[data-business-type]');
    const priorityTrigger = event.target.closest('[data-priority]');

    if (actionTrigger) {
      const action = actionTrigger.getAttribute('data-step-action');

      if (action === 'back-to-details') {
        experienceState.step = 1;
        experienceState.errorMessage = '';
      }

      if (action === 'next-to-priority') {
        const selectedBusinessType = getSelectedBusinessType();

        if (!selectedBusinessType) {
          experienceState.errorMessage = 'Select a business type or enter your custom option to continue.';
          refreshExperienceUI();
          return;
        }

        try {
          await persistDraftProgress({ businessType: selectedBusinessType });
          experienceState.step = 3;
          experienceState.errorMessage = '';
        } catch (error) {
          experienceState.errorMessage = error.message || 'We could not save your business type right now.';
        }
      }

      if (action === 'back-to-business') {
        experienceState.step = 2;
        experienceState.errorMessage = '';
      }

      if (action === 'generate-blueprint' && getSelectedPriorities().length && !experienceState.isSubmitting) {
        await submitExperienceBlueprint();
        return;
      }

      if (action === 'open-followup-now') {
        completeDemoFlow();
        return;
      }

      if (action === 'finish-demo') {
        stopDemoCountdown();
        experienceState = {
          ...experienceState,
          followupVisible: true,
          appointmentRequestError: ''
        };
        dismissExperienceModal();
        return;
      }

      if (action === 'restart-test-drive') {
        clearStoredExperienceDraftId();
        experienceState = createInitialExperienceState();
      }

      refreshExperienceUI();
      return;
    }

    if (businessTrigger) {
      const selectedValue = businessTrigger.getAttribute('data-business-type') || '';

      experienceState.businessTypeSelection = selectedValue;

      if (selectedValue !== otherOptionValue) {
        experienceState.businessTypeCustom = '';
      }

      experienceState.errorMessage = '';
      refreshExperienceUI();

      if (selectedValue === otherOptionValue) {
        focusWizardInput('#experienceBusinessTypeOther');
      }

      return;
    }

    if (priorityTrigger) {
      const selectedValue = priorityTrigger.getAttribute('data-priority') || '';
      const prioritySelections = Array.isArray(experienceState.prioritySelections)
        ? experienceState.prioritySelections
        : [];
      const wasSelected = prioritySelections.includes(selectedValue);

      experienceState.prioritySelections = wasSelected
        ? prioritySelections.filter((value) => value !== selectedValue)
        : [...prioritySelections, selectedValue];

      if (selectedValue === otherOptionValue && wasSelected) {
        experienceState.priorityCustom = '';
      }

      experienceState.errorMessage = '';
      refreshExperienceUI();

      if (!wasSelected && selectedValue === otherOptionValue) {
        focusWizardInput('#experiencePriorityOther');
      }
    }
  });

  experienceWizard.addEventListener('input', (event) => {
    if (event.target.id === 'experienceBusinessTypeOther') {
      experienceState.businessTypeCustom = event.target.value;
      experienceState.errorMessage = '';
      syncExperienceActionState();
      return;
    }

    if (event.target.id === 'experiencePriorityOther') {
      experienceState.priorityCustom = event.target.value;
      experienceState.errorMessage = '';
      syncExperienceActionState();
    }
  });

  experienceWizard.addEventListener('change', async (event) => {
    if (event.target.id === 'experienceBusinessTypeOther') {
      const selectedBusinessType = getSelectedBusinessType();

      if (selectedBusinessType) {
        try {
          await persistDraftProgress({ businessType: selectedBusinessType }, { silent: true });
        } catch {
          // no-op: silent mode handles the warning path
        }
      }

      return;
    }

    if (event.target.id === 'experiencePriorityOther') {
      const selectedPriorities = getSelectedPriorities();

      if (selectedPriorities.length) {
        try {
          await persistDraftProgress({ priorities: selectedPriorities }, { silent: true });
        } catch {
          // no-op: silent mode handles the warning path
        }
      }
    }
  });

  experienceWizard.addEventListener('submit', async (event) => {
    if (event.target.id !== 'experienceDetailsForm') {
      return;
    }

    event.preventDefault();

    const form = event.target;

    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }

    const formData = new FormData(form);
    const draftPayload = {
      name: String(formData.get('name') || '').trim(),
      email: String(formData.get('email') || '').trim(),
      businessName: String(formData.get('businessName') || '').trim()
    };

    experienceState = {
      ...experienceState,
      ...draftPayload,
      errorMessage: '',
      isSavingDraft: true
    };

    refreshExperienceUI();

    try {
      const savedDraft = experienceState.draftId
        ? await updateExperienceDraft(experienceState.draftId, draftPayload)
        : await createExperienceDraft(draftPayload);

      setStoredExperienceDraftId(savedDraft.draftId);
      experienceState = {
        ...hydrateExperienceStateFromDraft(savedDraft),
        step: 2
      };
    } catch (error) {
      experienceState = {
        ...experienceState,
        isSavingDraft: false,
        errorMessage: error.message || 'We could not save your details right now.'
      };
    }

    refreshExperienceUI();
  });

  followupHost.addEventListener('click', (event) => {
    const followupAction = event.target.closest('[data-followup-action]');

    if (!followupAction) {
      return;
    }

    const action = followupAction.getAttribute('data-followup-action');

    if (action === 'reopen-blueprint') {
      experienceState = {
        ...experienceState,
        returningFromFollowup: true,
        followupVisible: false,
        appointmentRequestError: ''
      };
      refreshExperienceUI();
      reopenTrigger.click();
      return;
    }

    if (action === 'complete-followup') {
      resetExperienceDemo();
      return;
    }

    if (action === 'toggle-schedule' && !experienceState.appointmentRequested) {
      experienceState = {
        ...experienceState,
        scheduleCallVisible: true,
        appointmentRequestError: ''
      };
      renderExperienceFollowup();
      window.requestAnimationFrame(() => {
        document.querySelector('#experienceReconfirmedEmail')?.focus();
      });
    }
  });

  followupHost.addEventListener('submit', async (event) => {
    if (event.target.id !== 'experienceFollowupForm') {
      return;
    }

    event.preventDefault();

    const formData = new FormData(event.target);
    const reconfirmedEmail = String(formData.get('email') || '').trim();

    if (!reconfirmedEmail) {
      experienceState = {
        ...experienceState,
        scheduleCallVisible: true,
        reconfirmedEmailInput: reconfirmedEmail,
        appointmentRequestError: 'Please re-enter your email to request your appointment.',
        appointmentRequestMessage: ''
      };
      renderExperienceFollowup();
      return;
    }

    if (!experienceState.draftId) {
      experienceState = {
        ...experienceState,
        scheduleCallVisible: true,
        reconfirmedEmailInput: reconfirmedEmail,
        appointmentRequestError: 'We could not find your automation record. Please reopen your blueprint and try again.',
        appointmentRequestMessage: ''
      };
      renderExperienceFollowup();
      return;
    }

    experienceState = {
      ...experienceState,
      scheduleCallVisible: true,
      reconfirmedEmailInput: reconfirmedEmail,
      isRequestingAppointment: true,
      appointmentRequestError: '',
      appointmentRequestMessage: ''
    };
    renderExperienceFollowup();

    try {
      const response = await fetch(`${apiBaseUrl}/api/automation-test-drive/${experienceState.draftId}/hot-lead`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: reconfirmedEmail })
      });
      const data = await parseApiResponse(response, 'We could not trigger your appointment request right now.');

      experienceState = {
        ...experienceState,
        scheduleCallVisible: true,
        reconfirmedEmailInput:
          data.draft?.reenteredEmail || data.draft?.reconfirmedEmail || data.draft?.confirmedContactEmail || reconfirmedEmail,
        isRequestingAppointment: false,
        appointmentRequested: true,
        appointmentRequestMessage: data.message || appointmentRequestSuccessMessage,
        appointmentRequestError: ''
      };
      renderExperienceFollowup();
    } catch (error) {
      experienceState = {
        ...experienceState,
        scheduleCallVisible: true,
        reconfirmedEmailInput: reconfirmedEmail,
        isRequestingAppointment: false,
        appointmentRequestError: error.message || 'We could not trigger your appointment request right now.',
        appointmentRequestMessage: ''
      };
      renderExperienceFollowup();
    }
  });

  experienceModal.addEventListener('show.bs.modal', () => {
    if (experienceState.followupVisible) {
      experienceState = {
        ...experienceState,
        followupVisible: false
      };
      renderExperienceFollowup();
    }

    restoreDraftFromStorage().catch((error) => {
      experienceState = {
        ...createInitialExperienceState(),
        errorMessage: error.message || 'We could not restore your saved draft right now.'
      };
      refreshExperienceUI();
    });
  });

  experienceModal.addEventListener('hidden.bs.modal', () => {
    const selectedBusinessType = getSelectedBusinessType();
    const selectedPriorities = getSelectedPriorities();
    const payload = {
      ...(selectedBusinessType ? { businessType: selectedBusinessType } : {}),
      ...(selectedPriorities.length ? { priorities: selectedPriorities } : {})
    };

    persistDraftProgress(payload, { silent: true }).catch(() => {});

    experienceState = {
      ...experienceState,
      errorMessage: '',
      isSavingDraft: false,
      isSubmitting: false,
      isRestoringDraft: false,
      followupVisible: Boolean(experienceState.blueprint && experienceState.demoFlowComplete)
    };
    renderExperienceFollowup();
  });
};

renderApp();
initializeContactForm();
initializeExperienceModal();