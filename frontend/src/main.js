import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './style.css';

const app = document.querySelector('#app');
const heroImageUrl = new URL('../assets/images/created for website.png', import.meta.url).href;
const apiBaseUrl = (
  import.meta.env.VITE_API_BASE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000' : '')
).replace(/\/$/, '');

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

const revenueSubsystems = [
  {
    number: '01',
    title: 'Lead Capture Systems',
    description: 'Captures interested people through website forms, chatbots, and landing pages so no high-intent visitor is missed.'
  },
  {
    number: '02',
    title: 'Automated Follow-Ups',
    description: 'Sends reminders, offers, and follow-up messages automatically when a customer does not buy immediately.'
  },
  {
    number: '03',
    title: 'Sales Funnels',
    description: 'Guides customers through a step-by-step path from interest to purchase, from landing page to offer, payment, and confirmation.'
  },
  {
    number: '04',
    title: 'CRM Integration',
    description: 'Keeps customers, conversations, purchases, and follow-ups organized automatically in one connected system.'
  },
  {
    number: '05',
    title: 'Payment Automation',
    description: 'Lets customers pay automatically through cards, mobile payments, and subscriptions without manual coordination.'
  }
];

const aboutArchitectureIcons = {
  identity:
    '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 12.25a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" stroke="currentColor" stroke-width="1.6"/><path d="M5.5 19.25a6.5 6.5 0 0 1 13 0" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  mission:
    '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="7.25" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="3.25" stroke="currentColor" stroke-width="1.6"/><path d="M12 2.75v2.1M12 19.15v2.1M21.25 12h-2.1M4.85 12h-2.1" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  capabilities:
    '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4.5" y="4.5" width="6" height="6" rx="1.4" stroke="currentColor" stroke-width="1.6"/><rect x="13.5" y="4.5" width="6" height="6" rx="1.4" stroke="currentColor" stroke-width="1.6"/><rect x="4.5" y="13.5" width="6" height="6" rx="1.4" stroke="currentColor" stroke-width="1.6"/><path d="M16.5 13.5v6M13.5 16.5h6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  values:
    '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 5.1 13.85 8.85l4.15.6-3 2.93.7 4.12L12 14.55 8.3 16.5l.7-4.12-3-2.93 4.15-.6L12 5.1Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M12 8.75v3.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  methods:
    '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7.25 6.5h5.25a3 3 0 0 1 3 3v1" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="m13.75 8.75 1.75 1.75 1.75-1.75" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M16.75 17.5h-5.25a3 3 0 0 1-3-3v-1" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="m10.25 15.25-1.75-1.75-1.75 1.75" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  directions:
    '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="7.25" stroke="currentColor" stroke-width="1.6"/><path d="m10 14 5-5-1.05 4.05L10 14Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M12 4.75v1.5M19.25 12h-1.5M12 19.25v-1.5M4.75 12h1.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>'
};

const aboutArchitectureNodes = [
  {
    number: '01',
    tone: 'teal',
    icon: aboutArchitectureIcons.identity,
    label: 'Identity',
    title: 'Who We Are',
    callout: 'We build intelligent digital systems that replace disconnected manual workflows.',
    summary: 'Expult Global builds intelligent digital systems that help businesses operate efficiently, automate critical workflows, and grow revenue with more structure.',
    body:
      'The company focuses on modern digital infrastructure for teams that want to move beyond manual processes and disconnected tools into scalable operating systems.',
    points: ['Technology company rooted in automation and software systems', 'Builds connected infrastructure for operations and growth', 'Helps businesses replace manual work with scalable workflows']
  },
  {
    number: '02',
    tone: 'crimson',
    icon: aboutArchitectureIcons.mission,
    label: 'Mission',
    title: 'Our Mission',
    callout: 'Our mission is to turn fragmented tools into integrated systems for growth.',
    summary: 'The mission is to help businesses transition from fragmented digital tools into integrated systems that improve productivity, customer engagement, and sustainable growth.',
    body:
      'Expult Global develops infrastructure that keeps working in the background so sales, service, and internal operations stay connected and reliable.',
    points: ['Reduce fragmentation across tools and workflows', 'Improve efficiency through connected automation', 'Support stronger customer and revenue systems']
  },
  {
    number: '03',
    tone: 'orange',
    icon: aboutArchitectureIcons.capabilities,
    label: 'Capabilities',
    title: 'What We Build',
    callout: 'We create AI support, automation, websites, funnels, data tools, and custom software.',
    summary: 'Expult Global develops practical technology solutions that solve real operational problems for modern organizations.',
    body:
      'Each solution is designed as part of a wider ecosystem that supports efficiency, customer flow, decision-making, and long-term revenue performance.',
    points: ['AI-powered customer support systems', 'Business process automation tools', 'High-converting websites and funnels', 'Data and intelligence platforms', 'Custom software for operational needs']
  },
  {
    number: '04',
    tone: 'amber',
    icon: aboutArchitectureIcons.values,
    label: 'Values',
    title: 'Why Businesses Work With Us',
    callout: 'Clients choose us for measurable efficiency, response speed, and stronger revenue flow.',
    summary: 'Businesses choose Expult Global for systems that create measurable operational and financial value.',
    body:
      'The focus is not just on building digital products but on creating infrastructure that helps teams capture opportunities, respond faster, and scale more confidently.',
    points: ['Capture and convert more qualified leads', 'Automate repetitive operational tasks', 'Improve response speed and data visibility', 'Create scalable platforms for long-term growth']
  },
  {
    number: '05',
    tone: 'orange',
    icon: aboutArchitectureIcons.methods,
    label: 'Methods',
    title: 'Our Approach',
    callout: 'Every solution is designed as part of one connected operating system.',
    summary: 'Expult Global applies systems thinking, building connected digital architectures rather than isolated tools.',
    body:
      'Lead capture, follow-up, CRM, payment, and insight layers are designed to work together so businesses can reduce missed opportunities and operate with more consistency.',
    points: ['Designs integrated ecosystems instead of one-off assets', 'Connects customer journeys from inquiry to purchase', 'Builds automation that runs continuously in the background']
  },
  {
    number: '06',
    tone: 'gold',
    icon: aboutArchitectureIcons.directions,
    label: 'Directions',
    title: 'Vision for the Future',
    callout: 'Our vision is enterprise-grade digital infrastructure made accessible to more businesses.',
    summary: 'Expult Global is building toward a future where advanced digital infrastructure is accessible to more businesses, not only large enterprises.',
    body:
      'Through automation systems, intelligent software, and data-driven tools, the company aims to help organizations compete more effectively in a technology-driven global economy.',
    points: ['Expand access to enterprise-style digital infrastructure', 'Empower businesses with intelligent systems', 'Support stronger participation in the digital economy']
  }
];

const serviceCardIcons = {
  support:
    '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 4.5a7.5 7.5 0 0 0-7.5 7.5v2.75A2.75 2.75 0 0 0 7.25 17.5H8.5v-6H7.25A2.74 2.74 0 0 0 5 12c0-3.87 3.13-7 7-7s7 3.13 7 7a2.74 2.74 0 0 0-2.25-.5H15.5v6h1.25c1.52 0 2.75-1.23 2.75-2.75V12A7.5 7.5 0 0 0 12 4.5Z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M9.5 19.25h5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M14.5 19.25A1.75 1.75 0 0 1 12.75 21h-1.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  automation:
    '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M10 4.75 6.75 10H11l-1 4.5L17.25 8H13l1-3.25H10Z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 18.5h14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  web:
    '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4" y="5" width="16" height="14" rx="2.5" stroke="currentColor" stroke-width="1.6"/><path d="M4 9.25h16" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M8 13h4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M8 16h8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  data:
    '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 17.5V10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M12 17.5V6.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M18 17.5v-4.75" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M4.75 18.5h14.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  custom:
    '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m9 6 3-2 3 2 3.5.5.5 3.5 2 3-2 3-.5 3.5-3.5.5-3 2-3-2-3.5-.5-.5-3.5-2-3 2-3 .5-3.5L9 6Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="m9.75 12 1.5 1.5 3-3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  cta:
    '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 7.5h14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M5 12h10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M5 16.5h8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="m15 14 4 4m0-4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  feature:
    '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m7.5 12 3 3 6-6" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  value:
    '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 5.25 13.97 9.24l4.4.64-3.18 3.1.75 4.38L12 15.3l-3.94 2.07.75-4.38-3.18-3.1 4.4-.64L12 5.25Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>'
};

const contactSectionIcons = {
  contact:
    '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5.75 7.5A2.75 2.75 0 0 1 8.5 4.75h7A2.75 2.75 0 0 1 18.25 7.5v9A2.75 2.75 0 0 1 15.5 19.25h-7a2.75 2.75 0 0 1-2.75-2.75v-9Z" stroke="currentColor" stroke-width="1.6"/><path d="m7 8.5 5 4 5-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  chat:
    '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7.75 18.5h7.5a5.75 5.75 0 1 0 0-11.5h-6.5A4.75 4.75 0 0 0 4 11.75v1a4.75 4.75 0 0 0 4.75 4.75h.35l1.65 2 .75-2Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M9 11.75h6M9 14.75h4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>'
};

const footerSocialIcons = {
  linkedin:
    '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 10.25v6.25" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M12 16.5v-3.5a2 2 0 0 1 4 0v3.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 7.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" fill="currentColor"/><rect x="4.75" y="4.75" width="14.5" height="14.5" rx="3.25" stroke="currentColor" stroke-width="1.5"/></svg>',
  instagram:
    '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4.75" y="4.75" width="14.5" height="14.5" rx="4" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="3.35" stroke="currentColor" stroke-width="1.5"/><circle cx="16.4" cy="7.6" r="0.9" fill="currentColor"/></svg>',
  x:
    '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6.5 5.75 17.5 18.25" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M17.5 5.75 6.5 18.25" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><rect x="4.75" y="4.75" width="14.5" height="14.5" rx="3.25" stroke="currentColor" stroke-width="1.5"/></svg>'
};

const footerSocialLinks = [
  { label: 'LinkedIn', icon: footerSocialIcons.linkedin, href: '#' },
  { label: 'Instagram', icon: footerSocialIcons.instagram, href: '#' },
  { label: 'X', icon: footerSocialIcons.x, href: '#' }
];

const otherServices = [
  {
    number: '01',
    tone: 'support',
    icon: serviceCardIcons.support,
    category: 'AI systems',
    title: 'AI-Powered Customer Support',
    description:
      'Expult Global deploys AI-driven customer support systems that respond instantly, automate common conversations, and guide visitors toward inquiries or bookings.',
    itemLabel: 'Includes',
    items: ['AI website chat assistants', 'Automated customer responses', 'Smart FAQ systems', 'Lead qualification bots'],
    businessValue:
      'Reduces support workload while ensuring customers always receive immediate responses, improving customer experience and increasing conversion rates.'
  },
  {
    number: '02',
    tone: 'automation',
    icon: serviceCardIcons.automation,
    category: 'Automation',
    title: 'Business Process Automation',
    description:
      'Expult Global designs automation systems that eliminate repetitive manual tasks so routine operational workflows can run more efficiently in the background.',
    itemLabel: 'Examples',
    items: ['Appointment booking systems', 'Invoice and payment automation', 'Document processing workflows', 'CRM workflow automation'],
    businessValue: 'Reduces operational delays, improves efficiency, and saves time by automating routine business processes.'
  },
  {
    number: '03',
    tone: 'web',
    icon: serviceCardIcons.web,
    category: 'Web conversion',
    title: 'High-Converting Websites',
    description:
      'Expult Global builds modern websites designed to do more than present a business online. They are built to convert visitors into leads and customers.',
    itemLabel: 'Includes',
    items: ['Landing pages', 'Sales funnels', 'Fast and optimized web design', 'Mobile-friendly platforms'],
    businessValue: 'Transforms websites into active revenue channels that capture leads and support customer acquisition.'
  },
  {
    number: '04',
    tone: 'data',
    icon: serviceCardIcons.data,
    category: 'Insights',
    title: 'Data & Intelligence Systems',
    description:
      'Expult Global builds data systems that collect, organize, and visualize key business data so teams can monitor performance and make informed decisions.',
    itemLabel: 'Examples',
    items: ['Business dashboards', 'Customer analytics', 'Revenue tracking systems', 'Data integrations'],
    businessValue:
      'Provides businesses with clear insights into their performance and enables data-driven decision making.'
  },
  {
    number: '05',
    tone: 'custom',
    icon: serviceCardIcons.custom,
    category: 'Custom build',
    title: 'Custom Software Development',
    description:
      'Expult Global develops tailored digital solutions for businesses that need tools beyond standard platforms, built around real workflows and operations.',
    itemLabel: 'Examples',
    items: ['Custom platforms', 'Internal business systems', 'SaaS applications', 'API integrations'],
    businessValue:
      'Gives businesses technology tailored to their operations, improving efficiency and supporting long-term scalability.'
  },
  {
    number: '06',
    tone: 'cta',
    icon: serviceCardIcons.cta,
    category: 'Custom services',
    title: 'Freely Contact Us for Custom Services',
    description:
      'If your business needs something more specialized, Expult Global can design a custom service around your exact workflow, operations, and growth direction.',
    items: ['Specialized workflows', 'Internal tools', 'New digital products', 'Custom integrations'],
    ctaNote: 'Tell us what you want built and we will shape the right next step with you.',
    ctaLabel: 'Freely Contact Us'
  }
];

const clientNames = [
  'Nanjo Enterprises',
  'Pendullum VSL',
  'Bailey Cons.',
  'Expult Cars',
  'Coldfire',
  'ICL Int Lawyers',
  'JedMon',
  'Jian',
  'Amber',
  'Cici',
  'WriteDom'
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

const chatStarterPrompts = [
  'What services does Expult Global offer?',
  'Do you build AI chat assistants for websites?',
  'Which solution is best for automating lead follow-up?'
];

let pendingContactPrefill = null;

const createInitialChatState = () => ({
  isActive: false,
  isLoadingServices: false,
  isSending: false,
  errorMessage: '',
  services: [],
  messages: [
    {
      role: 'assistant',
      content: 'Hi, I’m Expult AI bot. Ask me about approved Expult services, automation systems, AI assistants, websites, data systems, or custom software.',
      matchedServices: [],
      followUpQuestion: '',
      leadCapture: null
    }
  ],
  lead: {
    name: '',
    email: '',
    company: '',
    serviceInterest: '',
    requestHumanFollowUp: false
  }
});

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
let chatbotState = createInitialChatState();

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const renderServiceInterestOptions = (serviceItems = services) =>
  serviceItems
    .map((service) => {
      const label = typeof service === 'string' ? service : service?.title || service?.name || service?.label || service?.slug || 'Service';
      return `<option value="${escapeHtml(label)}">${escapeHtml(label)}</option>`;
    })
    .join('');

const getTeamTypeFromLabel = (label = '') => {
  if (label.includes('Service')) {
    return 'Service Businesses';
  }

  if (label.includes('Enterprise')) {
    return 'Enterprise Teams';
  }

  if (label.includes('Founder')) {
    return 'Founders';
  }

  return 'General Inquiry';
};

const renderAboutPanelContent = ({ number, label, title, summary, body, points, icon }) => `
  <div class="about-architecture-panel-content">
    <span class="about-panel-shell" aria-hidden="true"></span>

    <div class="about-panel-head">
      <span class="about-panel-icon-badge">
        <span class="about-panel-symbol" aria-hidden="true">${icon}</span>
        <span class="about-panel-number">${escapeHtml(number)}</span>
      </span>

      <div class="about-panel-head-copy">
        <span class="about-panel-kicker">${escapeHtml(label)}</span>
        <h3>${escapeHtml(title)}</h3>
      </div>
    </div>

    <p class="about-panel-summary">${escapeHtml(summary)}</p>

    <div class="about-panel-value">
      <span class="about-panel-value-icon" aria-hidden="true">${icon}</span>
      <div class="about-panel-value-copy">
        <span class="about-panel-label">Expanded view</span>
        <p class="about-panel-body">${escapeHtml(body)}</p>
      </div>
    </div>

    <div class="about-panel-stack">
      <div class="about-panel-stack-head">
        <span class="about-panel-label">Key focus areas</span>
      </div>

      <ul class="about-panel-list">
        ${points
          .map(
            (point) => `
              <li class="about-panel-list-item">
                <span class="about-panel-list-dot" aria-hidden="true"></span>
                <span>${escapeHtml(point)}</span>
              </li>
            `
          )
          .join('')}
      </ul>
    </div>
  </div>
`;

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
  return items
    .map((item) => {
      if (type === 'service') {
        return `
          <li>
            <button class="dropdown-item" type="button" data-bs-toggle="modal" data-bs-target="#experienceModal">
              ${escapeHtml(item)}
            </button>
          </li>
        `;
      }

      return `
        <li>
          <button class="dropdown-item" type="button" data-contact-target="form" data-team-type="${escapeHtml(item)}">
            ${escapeHtml(item)}
          </button>
        </li>
      `;
    })
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
                <li class="nav-item"><a class="nav-link" href="#about-expult">About</a></li>
                <li class="nav-item">
                  <button class="nav-link btn btn-link" type="button" data-contact-target="form">
                    Contact
                  </button>
                </li>
              </ul>

              <button class="btn btn-contact ms-lg-3" type="button" data-contact-target="form">
                Talk to Us
              </button>
            </div>
          </div>
        </nav>
      </header>

      <main id="home" class="hero-section" style="--hero-image: url('${heroImageUrl}')">
        <div class="hero-background-overlay"></div>
        <div class="container hero-content">
          <div class="row align-items-end hero-row">
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

            <div class="col-lg d-flex justify-content-end mt-4 mt-lg-0">
              <div class="hero-scroll-action">
                <span class="hero-scroll-hint">Click me</span>
                <button
                  class="hero-scroll-button"
                  type="button"
                  data-scroll-target="#revenue-subsystems"
                  aria-label="Scroll to the Revenue Automation Systems subsystem section"
                >
                  <span aria-hidden="true">↓</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      ${renderRevenueSubsystemSection()}
      ${renderOtherServicesSection()}
      ${renderAboutSection()}
      ${renderClientsSection()}
      ${renderContactSection()}
      ${renderFooterSection()}
    </div>

    ${renderContactModal()}

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

const renderAboutSection = () => {
  const initialIndex = 0;
  const initialNode = aboutArchitectureNodes[initialIndex];

  return `
    <section class="about-architecture-section" id="about-expult" aria-labelledby="aboutExpultTitle">
      <div class="container about-architecture-layout">
        <div class="about-architecture-intro">
          <span class="hero-eyebrow">Company Architecture</span>
          <h2 id="aboutExpultTitle">About Expult Global</h2>
          <p class="subsystems-copy about-architecture-copy">
            Explore the core ideas behind Expult Global through a structured company architecture. Each circle opens a deeper view into the identity, mission, capabilities, values, methods, and direction guiding the company.
          </p>
        </div>

        <div class="about-architecture-gallery" aria-label="Interactive Expult Global company architecture lightbox gallery">
          <span class="about-architecture-gallery-line" aria-hidden="true"></span>
          ${aboutArchitectureNodes
            .map(
              ({ label, icon }, index) => `
                <article class="about-gallery-step ${index === initialIndex ? 'active' : 'inactive'}" data-about-step="${index}">
                  <button
                    class="about-gallery-node"
                    type="button"
                    data-about-index="${index}"
                    aria-pressed="${index === initialIndex ? 'true' : 'false'}"
                    aria-controls="aboutArchitecturePanel"
                    aria-label="Show ${escapeHtml(label)} details"
                  >
                    <span class="about-gallery-node-circle" aria-hidden="true">
                      <span class="about-gallery-node-icon">${icon}</span>
                      <span class="about-gallery-node-label">${escapeHtml(label)}</span>
                    </span>
                  </button>
                </article>
              `
            )
            .join('')}
        </div>

        <aside class="about-architecture-focus is-fading-in" id="aboutArchitecturePanel" aria-live="polite">
          ${renderAboutPanelContent(initialNode)}
        </aside>
      </div>
    </section>
  `;
};

const renderRevenueSubsystemSection = () => {
  return `
    <section class="subsystems-section" id="revenue-subsystems" aria-labelledby="revenueSubsystemsTitle">
      <div class="container">
        <div class="section-heading section-heading-centered">
          <span class="hero-eyebrow">What Expult Tech Actually Builds</span>
          <h2 id="revenueSubsystemsTitle">Sub Systems under Revenue Automation Systems</h2>
          <p class="subsystems-copy">
            A combination of these subsystems helps businesses convert website visitors into customers, increase revenue with less manual work, and strengthen overall revenue streams.
          </p>
        </div>

        <div class="subsystems-flow" aria-label="Revenue automation subsystem overview">
          ${revenueSubsystems
            .map(
              ({ number, title, description }, index) => `
                <article
                  class="subsystem-step ${index === 0 ? 'active' : 'inactive'}"
                >
                  <button
                    class="subsystem-node"
                    type="button"
                    data-subsystem-index="${index}"
                    aria-pressed="${index === 0 ? 'true' : 'false'}"
                    aria-label="Focus ${escapeHtml(title)}"
                  >
                    <span class="subsystem-copy-block">
                      <h3>${escapeHtml(title)}</h3>
                      <p>${escapeHtml(description)}</p>
                    </span>

                    <span class="subsystem-divider" aria-hidden="true"></span>

                    <span class="subsystem-circle" aria-hidden="true">
                      <span>${number}</span>
                    </span>
                  </button>
                </article>
              `
            )
            .join('')}
        </div>
      </div>
    </section>
  `;
};

const renderOtherServicesSection = () => {
  return `
    <section class="services-section" id="other-services" aria-labelledby="otherServicesTitle">
      <div class="container services-layout">
        <div class="section-heading section-heading-centered services-heading">
          <span class="hero-eyebrow">Beyond Revenue Automation Systems</span>
          <h2 id="otherServicesTitle">Other Services offered:</h2>
          <p class="subsystems-copy services-copy">
            Expult Global also builds smart support, automation, web, data, and custom delivery systems that help businesses operate faster and grow with less friction.
          </p>
        </div>

        <div class="services-grid" aria-label="Other services offered by Expult Global">
          ${otherServices
            .map((service) => {
              if (service.ctaLabel) {
                return `
                  <article class="service-card service-card-${service.tone} service-card-cta">
                    <span class="service-card-shell" aria-hidden="true"></span>

                    <div class="service-card-head">
                      <span class="service-card-icon-badge">
                        <span class="service-card-icon">${service.icon}</span>
                        <span class="service-card-number">${service.number}</span>
                      </span>

                      <div class="service-card-head-copy">
                        <span class="service-card-category">${escapeHtml(service.category)}</span>
                        <h3>${escapeHtml(service.title)}</h3>
                      </div>
                    </div>

                    <p class="service-card-description">${escapeHtml(service.description)}</p>

                    <div class="service-card-stack">
                      <div class="service-card-stack-head">
                        <span class="service-card-label">Perfect for</span>
                      </div>

                      <ul class="service-feature-list service-feature-list-cta" aria-label="${escapeHtml(service.title)} use cases">
                        ${service.items
                          .map(
                            (item) => `
                              <li class="service-feature-item">
                                <span class="service-feature-icon">${serviceCardIcons.feature}</span>
                                <span>${escapeHtml(item)}</span>
                              </li>
                            `
                          )
                          .join('')}
                      </ul>
                    </div>

                    <div class="service-card-footer">
                      <p class="service-card-cta-note">${escapeHtml(service.ctaNote)}</p>
                      <button
                        class="btn btn-primary-glow service-card-action"
                        type="button"
                        data-contact-target="form"
                        data-team-type="General Inquiry"
                      >
                        ${escapeHtml(service.ctaLabel)}
                      </button>
                    </div>
                  </article>
                `;
              }

              return `
                <article class="service-card service-card-${service.tone}">
                  <span class="service-card-shell" aria-hidden="true"></span>

                  <div class="service-card-head">
                    <span class="service-card-icon-badge">
                      <span class="service-card-icon">${service.icon}</span>
                      <span class="service-card-number">${service.number}</span>
                    </span>

                    <div class="service-card-head-copy">
                      <span class="service-card-category">${escapeHtml(service.category)}</span>
                      <h3>${escapeHtml(service.title)}</h3>
                    </div>
                  </div>

                  <p class="service-card-description">${escapeHtml(service.description)}</p>

                  <div class="service-card-stack">
                    <div class="service-card-stack-head">
                      <span class="service-card-label">${escapeHtml(service.itemLabel)}</span>
                    </div>

                    <ul class="service-feature-list" aria-label="${escapeHtml(service.title)} ${escapeHtml(service.itemLabel).toLowerCase()}">
                      ${service.items
                        .map(
                          (item) => `
                            <li class="service-feature-item">
                              <span class="service-feature-icon">${serviceCardIcons.feature}</span>
                              <span>${escapeHtml(item)}</span>
                            </li>
                          `
                        )
                        .join('')}
                    </ul>
                  </div>

                  <div class="service-card-value">
                    <span class="service-card-value-icon">${serviceCardIcons.value}</span>
                    <div class="service-card-value-copy">
                      <span class="service-card-label">Business Value</span>
                      <p>${escapeHtml(service.businessValue)}</p>
                    </div>
                  </div>
                </article>
              `;
            })
            .join('')}
        </div>
      </div>
    </section>
  `;
};

const renderContactSection = () => {
  return `
    <section class="contact-section" id="contact-us" aria-labelledby="contactUsTitle">
      <div class="container contact-layout">
        <div class="section-heading section-heading-centered contact-heading">
          <span class="hero-eyebrow">Contact Us</span>
          <h2 id="contactUsTitle">Start a conversation with Expult Global</h2>
          <p class="subsystems-copy contact-copy">
            Choose the route that fits your team best. Open the contact form for a project brief or use the embedded chat to ask grounded questions about approved Expult services.
          </p>
        </div>

        <div class="contact-split-shell">
          <article class="contact-panel contact-panel-form" id="contactFormPanel">
            <div class="contact-panel-intro">
              <div class="contact-panel-copy">
                <span class="contact-panel-kicker">Leave us a message</span>
                <h3>Tell us what you want to build</h3>
                <p>
                  Share the workflow, platform, or automation goal you want Expult Global to solve and we will follow up with the right next step.
                </p>
                <button class="btn btn-primary-glow" type="button" data-contact-target="form">Leave message</button>
              </div>

              <button
                class="contact-activation-button"
                type="button"
                data-contact-target="form"
                aria-controls="contactModal"
                aria-haspopup="dialog"
              >
                <span class="contact-panel-icon" aria-hidden="true">${contactSectionIcons.contact}</span>
              </button>
            </div>
          </article>

          <span class="contact-split-divider" aria-hidden="true"></span>

          <article class="contact-panel contact-panel-chat" id="contactChatPanel">
            <div class="contact-panel-intro contact-chat-intro" id="chatIntroPanel">
              <button
                class="contact-activation-button"
                type="button"
                data-contact-target="chat"
                aria-controls="contactChatApp"
                aria-expanded="false"
              >
                <span class="contact-panel-icon" aria-hidden="true">${contactSectionIcons.chat}</span>
              </button>

              <div class="contact-panel-copy">
                <span class="contact-panel-kicker">Messaging interface</span>
                <h3>Chat with Us</h3>
                <p>
                  Experience instant responses for approved Expult services and more. Learn more about our culture and way of workings.
                </p>
                <button class="btn btn-primary-glow" type="button" data-contact-target="chat">Chat with Us</button>
              </div>
            </div>

              <div class="contact-chat-shell">
                <div class="contact-chat-app" id="contactChatApp" aria-hidden="true">
                <div class="contact-chat-header">
                  <div>
                    <span class="contact-chat-header-label">Expult AI bot</span>
                    <p>Lets have a beneficial talk.</p>
                  </div>
                  <div class="contact-chat-header-actions">
                    <button class="btn btn-ghost contact-chat-restart" id="chatRestartButton" type="button" aria-label="Start a new conversation">
                      <span class="contact-chat-restart-icon" aria-hidden="true">+</span>
                    </button>
                    <button class="btn btn-ghost contact-chat-close" id="chatCloseButton" type="button" aria-label="Close chat">
                      <span class="contact-chat-close-icon" aria-hidden="true">×</span>
                    </button>
                  </div>
                </div>

                <div id="chatFeedback" class="mb-3"></div>
                <div class="contact-chat-service-strip-shell" aria-label="Quick messages">
                  <button
                    class="btn btn-ghost contact-chat-strip-button is-left"
                    id="chatServiceStripPrev"
                    type="button"
                    aria-label="Scroll quick messages left"
                    hidden
                  >
                    <span aria-hidden="true">‹</span>
                  </button>
                  <div class="contact-chat-service-strip-viewport">
                    <div class="contact-chat-service-strip" id="chatbotServiceChips" aria-label="Approved Expult services"></div>
                  </div>
                  <button
                    class="btn btn-ghost contact-chat-strip-button is-right"
                    id="chatServiceStripNext"
                    type="button"
                    aria-label="Scroll quick messages right"
                    hidden
                  >
                    <span aria-hidden="true">›</span>
                  </button>
                </div>
                <div class="contact-chat-messages" id="chatMessageList" aria-live="polite"></div>

                <form class="contact-chat-composer" id="chatComposer" novalidate>
                  <label class="visually-hidden" for="chatMessageInput">Ask Expult Support a question</label>
                  <textarea
                    class="form-control contact-chat-input"
                    id="chatMessageInput"
                    rows="1"
                    placeholder="Type message here..."
                    disabled
                    required
                  ></textarea>
                  <button class="btn btn-primary-glow contact-chat-send" id="chatSendButton" type="submit" disabled>
                    Send
                  </button>
                </form>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  `;
};

const renderFooterSection = () => {
  const socialLinksMarkup = footerSocialLinks
    .map(
      ({ label, icon, href }) => `
        <a class="site-footer-social-link" href="${href}" aria-label="Visit Expult Global on ${label}">
          <span aria-hidden="true">${icon}</span>
        </a>
      `
    )
    .join('');

  return `
    <footer class="site-footer" aria-label="Site footer">
      <div class="container site-footer-layout">
        <p class="site-footer-copy">Powered by <span class="site-footer-brand">Expult Global</span></p>
        <div class="site-footer-socials" aria-label="Social media links">
          ${socialLinksMarkup}
        </div>
      </div>
    </footer>
  `;
};

const renderContactModal = () => {
  return `
    <div class="modal fade" id="contactModal" tabindex="-1" aria-labelledby="contactModalLabel" aria-hidden="true">
      <div class="modal-dialog contact-modal-dialog">
        <div class="modal-content contact-modal">
          <div class="modal-header border-0 pb-0 contact-modal-header">
            <div class="contact-modal-header-title">
              <span class="contact-panel-icon contact-modal-icon" aria-hidden="true">${contactSectionIcons.chat}</span>
              <h2 class="modal-title mb-0" id="contactModalLabel">Chat with Us</h2>
            </div>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body pt-3">
            <div class="contact-form-wrap contact-modal-form-wrap">
              <div id="contactFeedback" class="mb-3"></div>

              <form id="contactForm" class="contact-form-shell" novalidate>
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label" for="contactName">Name</label>
                    <input class="form-control" id="contactName" name="name" type="text" placeholder="Your name" required />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label" for="contactEmail">Email</label>
                    <input class="form-control" id="contactEmail" name="email" type="email" placeholder="you@company.com" required />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label" for="contactCompany">Company</label>
                    <input class="form-control" id="contactCompany" name="company" type="text" placeholder="Company or brand" required />
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
                    <label class="form-label" for="contactMessage">What do you want to automate?</label>
                    <textarea
                      class="form-control"
                      id="contactMessage"
                      name="message"
                      rows="4"
                      placeholder="Describe the revenue or operations challenge you want Expult Global to solve."
                      required
                    ></textarea>
                  </div>
                </div>

                <div class="experience-actions modal-actions mt-4">
                  <div class="experience-actions-side">
                    <button class="btn btn-ghost" type="button" data-bs-dismiss="modal">Close</button>
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
    </div>

    <button
      class="d-none"
      id="contactModalReopenTrigger"
      type="button"
      data-bs-toggle="modal"
      data-bs-target="#contactModal"
      tabindex="-1"
      aria-hidden="true"
    ></button>
  `;
};

const renderClientsSection = () => {
  const clientItems = clientNames
    .map(
      (name) => `
        <li class="clients-marquee-item">
          <span class="clients-marquee-label">${escapeHtml(name.toUpperCase())}</span>
        </li>
      `
    )
    .join('');

  return `
    <section class="clients-section" id="our-clients" aria-labelledby="ourClientsTitle">
      <div class="container clients-layout">
        <div class="section-heading section-heading-centered clients-heading">
          <span class="hero-eyebrow">Trusted businesses</span>
          <h2 id="ourClientsTitle">Our Clients</h2>
          <p class="subsystems-copy clients-copy">
            A growing network of businesses trust Expult Global to design elegant digital systems that support visibility, automation, and growth.
          </p>
        </div>

        <div class="clients-marquee-panel">
          <div class="clients-marquee-viewport" aria-label="Selected Expult Global clients">
            <div class="clients-marquee-track">
              <ul class="clients-marquee-group">
                ${clientItems}
              </ul>

              <ul class="clients-marquee-group" aria-hidden="true">
                ${clientItems}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
};

const initializeRevenueSubsystemSection = () => {
  const heroScrollTrigger = document.querySelector('[data-scroll-target]');
  const heroScrollTargetSelector = heroScrollTrigger?.getAttribute('data-scroll-target');
  const heroScrollTarget = heroScrollTargetSelector ? document.querySelector(heroScrollTargetSelector) : null;
  const triggers = [...document.querySelectorAll('[data-subsystem-index]')];
  const steps = [...document.querySelectorAll('.subsystem-step')];

  if (heroScrollTrigger && heroScrollTarget) {
    heroScrollTrigger.addEventListener('click', () => {
      heroScrollTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  if (!triggers.length || !steps.length) {
    return;
  }

  const setActiveSubsystem = (index) => {
    const safeIndex = revenueSubsystems[index] ? index : 0;

    steps.forEach((step, stepIndex) => {
      const isActive = stepIndex === safeIndex;
      const trigger = step.querySelector('[data-subsystem-index]');

      step.classList.toggle('active', isActive);
      step.classList.toggle('inactive', !isActive);
      trigger?.setAttribute('aria-pressed', String(isActive));
    });
  };

  triggers.forEach((trigger) => {
    const subsystemIndex = Number(trigger.getAttribute('data-subsystem-index'));

    trigger.addEventListener('click', () => {
      setActiveSubsystem(subsystemIndex);
    });
  });
};

const initializeAboutSection = () => {
  const aboutSection = document.querySelector('#about-expult');
  const panel = aboutSection?.querySelector('#aboutArchitecturePanel');
  const gallery = aboutSection?.querySelector('.about-architecture-gallery');
  const triggers = [...(aboutSection?.querySelectorAll('[data-about-index]') || [])];
  const steps = [...(aboutSection?.querySelectorAll('[data-about-step]') || [])];

  if (!aboutSection || !panel || !gallery || !triggers.length || !steps.length) {
    return;
  }

  let activeAboutIndex = -1;
  let panelSwapTimer = null;
  let panelRevealTimer = null;
  const panelTransitionDuration = 180;

  const renderActiveAboutPanel = (node) => {
    panel.innerHTML = renderAboutPanelContent(node);
    panel.classList.remove('is-fading-out');
    panel.classList.add('is-fading-in');

    window.clearTimeout(panelRevealTimer);
    panelRevealTimer = window.setTimeout(() => {
      panel.classList.remove('is-fading-in');
    }, panelTransitionDuration + 60);
  };

  const syncAboutState = (safeIndex) => {
    steps.forEach((step, stepIndex) => {
      const isActive = stepIndex === safeIndex;
      const distance = Math.abs(stepIndex - safeIndex);
      const trigger = step.querySelector('[data-about-index]');
      const direction = stepIndex < safeIndex ? 1 : stepIndex > safeIndex ? -1 : 0;
      const scaleByDistance = [1.14, 0.88, 0.74, 0.62, 0.54, 0.48];
      const opacityByDistance = [1, 0.82, 0.62, 0.46, 0.34, 0.26];
      const distanceIndex = Math.min(distance, scaleByDistance.length - 1);

      step.style.setProperty('--about-depth', String(distance));
      step.style.setProperty('--about-stack-direction', String(direction));
      step.style.setProperty('--about-node-scale', String(scaleByDistance[distanceIndex]));
      step.style.setProperty('--about-node-opacity', String(opacityByDistance[distanceIndex]));
      step.classList.toggle('active', isActive);
      step.classList.toggle('inactive', !isActive);
      step.classList.toggle('is-near', distance === 1);
      step.classList.toggle('is-mid', distance === 2);
      step.classList.toggle('is-far', distance >= 3);
      step.classList.toggle('is-before', stepIndex < safeIndex);
      step.classList.toggle('is-after', stepIndex > safeIndex);
      trigger?.setAttribute('aria-pressed', String(isActive));
    });
  };

  const centerActiveAboutNode = (safeIndex, behavior) => {
    const activeStep = steps[safeIndex];

    if (!activeStep) {
      return;
    }

    const targetTop = activeStep.offsetTop - (gallery.clientHeight - activeStep.offsetHeight) / 2;

    gallery.scrollTo({
      top: Math.max(targetTop, 0),
      behavior,
    });
  };

  const setActiveAboutNode = (index, { immediate = false } = {}) => {
    const safeIndex = aboutArchitectureNodes[index] ? index : 0;

    if (safeIndex === activeAboutIndex && !immediate) {
      return;
    }

    const activeNode = aboutArchitectureNodes[safeIndex];
    activeAboutIndex = safeIndex;

    syncAboutState(safeIndex);
    centerActiveAboutNode(safeIndex, immediate ? 'auto' : 'smooth');
    window.clearTimeout(panelSwapTimer);
    window.clearTimeout(panelRevealTimer);

    if (immediate) {
      renderActiveAboutPanel(activeNode);
      return;
    }

    panel.classList.remove('is-fading-in');
    panel.classList.add('is-fading-out');

    panelSwapTimer = window.setTimeout(() => {
      renderActiveAboutPanel(activeNode);
    }, panelTransitionDuration);
  };

  triggers.forEach((trigger) => {
    const aboutIndex = Number(trigger.getAttribute('data-about-index'));

    trigger.addEventListener('click', () => {
      setActiveAboutNode(aboutIndex);
    });
  });

  setActiveAboutNode(0, { immediate: true });
};

const initializeContactForm = () => {
  const contactSection = document.querySelector('#contact-us');
  const contactModal = document.querySelector('#contactModal');
  const contactForm = document.querySelector('#contactForm');
  const contactFeedback = document.querySelector('#contactFeedback');
  const contactSubmitButton = document.querySelector('#contactSubmitButton');
  const teamTypeField = document.querySelector('#teamType');
  const nameField = document.querySelector('#contactName');
  const emailField = document.querySelector('#contactEmail');
  const companyField = document.querySelector('#contactCompany');
  const messageField = document.querySelector('#contactMessage');
  const activationButtons = [...document.querySelectorAll('[data-contact-target="form"]')];
  const reopenTrigger = document.querySelector('#contactModalReopenTrigger');
  let shouldFocusFieldOnOpen = false;

  if (
    !contactSection ||
    !contactModal ||
    !contactForm ||
    !contactFeedback ||
    !contactSubmitButton ||
    !teamTypeField ||
    !nameField ||
    !emailField ||
    !companyField ||
    !messageField ||
    !reopenTrigger
  ) {
    return;
  }

  const hydratePendingContactPrefill = () => {
    if (!pendingContactPrefill) {
      return;
    }

    nameField.value = pendingContactPrefill.name || '';
    emailField.value = pendingContactPrefill.email || '';
    companyField.value = pendingContactPrefill.company || '';
    teamTypeField.value = pendingContactPrefill.teamType || 'General Inquiry';
    messageField.value = pendingContactPrefill.message || '';
    pendingContactPrefill = null;
  };

  const createContactDraft = (teamTypeLabel = '') => ({
    name: nameField.value.trim(),
    email: emailField.value.trim(),
    company: companyField.value.trim(),
    teamType: teamTypeLabel ? getTeamTypeFromLabel(teamTypeLabel) : teamTypeField.value,
    message: messageField.value.trim()
  });

  const focusPreferredField = () => {
    const preferredField = nameField.value ? messageField : nameField;

    window.setTimeout(() => {
      preferredField?.focus();
    }, 60);
  };

  const openContactModal = ({ focusField = false, shouldScroll = false } = {}) => {
    shouldFocusFieldOnOpen = focusField;

    const triggerOpen = () => {
      if (contactModal.classList.contains('show')) {
        hydratePendingContactPrefill();

        if (shouldFocusFieldOnOpen) {
          shouldFocusFieldOnOpen = false;
          focusPreferredField();
        }

        return;
      }

      reopenTrigger.click();
    };

    if (shouldScroll) {
      contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.setTimeout(triggerOpen, 220);
      return;
    }

    triggerOpen();
  };

  activationButtons.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const teamTypeLabel = trigger.getAttribute('data-team-type');

      contactFeedback.innerHTML = '';

      pendingContactPrefill = createContactDraft(teamTypeLabel || '');
      openContactModal({
        focusField: true,
        shouldScroll: !trigger.closest('#contact-us')
      });
    });
  });

  contactModal.addEventListener('shown.bs.modal', () => {
    hydratePendingContactPrefill();

    if (shouldFocusFieldOnOpen) {
      shouldFocusFieldOnOpen = false;
      focusPreferredField();
    }
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

      const data = await parseApiResponse(response, 'Unable to send your request right now.');

      contactFeedback.innerHTML = `<div class="alert alert-success mb-0">${data.message}</div>`;
      contactForm.reset();
      contactForm.classList.remove('was-validated');
      teamTypeField.value = '';
      pendingContactPrefill = null;
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

const initializeChatbotPanel = () => {
  const contactSection = document.querySelector('#contact-us');
  const chatPanel = document.querySelector('#contactChatPanel');
  const chatIntroPanel = document.querySelector('#chatIntroPanel');
  const chatApp = document.querySelector('#contactChatApp');
  const chatServiceChips = document.querySelector('#chatbotServiceChips');
  const chatServiceStripPrev = document.querySelector('#chatServiceStripPrev');
  const chatServiceStripNext = document.querySelector('#chatServiceStripNext');
  const chatMessageList = document.querySelector('#chatMessageList');
  const chatFeedback = document.querySelector('#chatFeedback');
  const chatComposer = document.querySelector('#chatComposer');
  const chatMessageInput = document.querySelector('#chatMessageInput');
  const chatSendButton = document.querySelector('#chatSendButton');
  const chatRestartButton = document.querySelector('#chatRestartButton');
  const chatCloseButton = document.querySelector('#chatCloseButton');
  const chatLeadName = document.querySelector('#chatLeadName');
  const chatLeadEmail = document.querySelector('#chatLeadEmail');
  const chatLeadCompany = document.querySelector('#chatLeadCompany');
  const chatLeadServiceInterest = document.querySelector('#chatLeadServiceInterest');
  const chatLeadFollowup = document.querySelector('#chatLeadFollowup');
  const activationButtons = [...document.querySelectorAll('[data-contact-target="chat"]')];
  const primaryChatToggle = chatPanel?.querySelector('[aria-controls="contactChatApp"]');
  const hasLeadFields = Boolean(chatLeadName && chatLeadEmail && chatLeadCompany && chatLeadServiceInterest && chatLeadFollowup);

  if (
    !contactSection ||
    !chatPanel ||
    !chatIntroPanel ||
    !chatApp ||
    !chatServiceChips ||
    !chatServiceStripPrev ||
    !chatServiceStripNext ||
    !chatMessageList ||
    !chatFeedback ||
    !chatComposer ||
    !chatMessageInput ||
    !chatSendButton ||
    !chatCloseButton
  ) {
    return;
  }

  const renderMessageBody = (content = '') => escapeHtml(content).replace(/\n/g, '<br />');

  const renderMatchedServiceChips = (matchedServices = []) =>
    matchedServices
      .map((service) => {
        const label = service?.title || service?.name || service?.label || service?.slug || 'Service';
        return `<span class="contact-chat-meta-pill">${escapeHtml(label)}</span>`;
      })
      .join('');

  const renderLeadCaptureStatus = (leadCapture) => {
    if (!leadCapture?.captured) {
      return '';
    }

    return `<span class="contact-chat-meta-pill">${leadCapture.requested ? 'Follow-up requested' : 'Lead details saved'}</span>`;
  };

  const renderServicePromptChips = () => {
    const serviceItems = (chatbotState.services.length ? chatbotState.services : services).slice(0, 6);

    return serviceItems
      .map((service) => {
        const label = typeof service === 'string' ? service : service?.title || service?.name || service?.label || service?.slug || 'Service';
        const prompt = `Tell me about ${label}.`;

        return `
          <button class="contact-chat-chip contact-chat-chip-service" type="button" data-chat-prompt="${escapeHtml(prompt)}">
            ${escapeHtml(label)}
          </button>
        `;
      })
      .join('');
  };

  const syncLeadInputs = () => {
    if (!hasLeadFields) {
      return;
    }

    chatLeadName.value = chatbotState.lead.name;
    chatLeadEmail.value = chatbotState.lead.email;
    chatLeadCompany.value = chatbotState.lead.company;
    chatLeadServiceInterest.value = chatbotState.lead.serviceInterest;
    chatLeadFollowup.checked = chatbotState.lead.requestHumanFollowUp;
  };

  const syncLeadState = () => {
    if (!hasLeadFields) {
      return;
    }

    chatbotState = {
      ...chatbotState,
      lead: {
        name: chatLeadName.value.trim(),
        email: chatLeadEmail.value.trim(),
        company: chatLeadCompany.value.trim(),
        serviceInterest: chatLeadServiceInterest.value,
        requestHumanFollowUp: chatLeadFollowup.checked
      }
    };
  };

  const getLeadPayload = () => {
    if (!hasLeadFields) {
      return {};
    }

    syncLeadState();

    return Object.fromEntries(
      Object.entries(chatbotState.lead).filter(([, value]) => {
        if (typeof value === 'boolean') {
          return value;
        }

        return Boolean(value);
      })
    );
  };

  const renderTypingIndicator = () => `
    <article class="contact-chat-message is-assistant is-typing" aria-live="polite" aria-label="Expult AI bot is typing">
      <div class="contact-chat-bubble contact-chat-bubble-typing">
        <span class="contact-chat-typing-dot"></span>
        <span class="contact-chat-typing-dot"></span>
        <span class="contact-chat-typing-dot"></span>
      </div>
    </article>
  `;

  const updateServiceStripControls = () => {
    const maxScrollLeft = Math.max(chatServiceChips.scrollWidth - chatServiceChips.clientWidth, 0);
    const hasOverflow = maxScrollLeft > 6;
    const canScrollLeft = chatServiceChips.scrollLeft > 6;
    const canScrollRight = chatServiceChips.scrollLeft < maxScrollLeft - 6;

    chatServiceStripPrev.hidden = !hasOverflow || !canScrollLeft;
    chatServiceStripNext.hidden = !hasOverflow || !canScrollRight;
    chatServiceStripPrev.disabled = !canScrollLeft;
    chatServiceStripNext.disabled = !canScrollRight;
  };

  const scrollServiceStrip = (direction) => {
    const scrollAmount = Math.max(Math.round(chatServiceChips.clientWidth * 0.72), 180);

    chatServiceChips.scrollBy({
      left: direction * scrollAmount,
      behavior: 'smooth'
    });
  };

  const renderChatbotPanel = () => {
    chatPanel.classList.toggle('is-active', chatbotState.isActive);
    chatIntroPanel.setAttribute('aria-hidden', String(chatbotState.isActive));
    chatApp.setAttribute('aria-hidden', String(!chatbotState.isActive));
    chatIntroPanel.toggleAttribute('inert', chatbotState.isActive);
    chatApp.toggleAttribute('inert', !chatbotState.isActive);
    primaryChatToggle?.setAttribute('aria-expanded', String(chatbotState.isActive));

    chatServiceChips.innerHTML = renderServicePromptChips();
    chatFeedback.innerHTML = chatbotState.errorMessage
      ? `<div class="alert alert-warning mb-0">${escapeHtml(chatbotState.errorMessage)}</div>`
      : '';

    const messageMarkup = chatbotState.messages
      .map((message) => {
        const isAssistant = message.role === 'assistant';
        const metaMarkup = isAssistant
          ? `${renderMatchedServiceChips(message.matchedServices)}${renderLeadCaptureStatus(message.leadCapture)}`
          : '';

        return `
          <article class="contact-chat-message ${isAssistant ? 'is-assistant' : 'is-user'}">
            <div class="contact-chat-bubble">
              <p>${renderMessageBody(message.content)}</p>
              ${message.followUpQuestion ? `<p class="contact-chat-followup">${renderMessageBody(message.followUpQuestion)}</p>` : ''}
              ${metaMarkup ? `<div class="contact-chat-meta-row">${metaMarkup}</div>` : ''}
            </div>
          </article>
        `;
      })
      .join('');

    chatMessageList.innerHTML = `${messageMarkup}${chatbotState.isSending ? renderTypingIndicator() : ''}`;

    syncLeadInputs();
    chatMessageInput.disabled = !chatbotState.isActive;
    chatSendButton.disabled = !chatbotState.isActive || chatbotState.isSending;
    chatSendButton.textContent = 'Send';

    window.requestAnimationFrame(() => {
      updateServiceStripControls();
      chatMessageList.scrollTop = chatMessageList.scrollHeight;
    });
  };

  const hydrateServiceInterestOptions = (serviceItems) => {
    if (!hasLeadFields) {
      return;
    }

    const nextOptions = serviceItems.length ? serviceItems : services;
    const previousValue = chatLeadServiceInterest.value;

    chatLeadServiceInterest.innerHTML = `
      <option value="">Select a service</option>
      ${renderServiceInterestOptions(nextOptions)}
    `;

    if (previousValue) {
      chatLeadServiceInterest.value = previousValue;
    }
  };

  const loadChatbotServices = async () => {
    if (chatbotState.isLoadingServices || chatbotState.services.length) {
      return;
    }

    chatbotState = {
      ...chatbotState,
      isLoadingServices: true
    };

    try {
      const response = await fetch(`${apiBaseUrl}/api/chatbot/services`);
      const data = await parseApiResponse(response, 'We could not load the current Expult service list.');

      chatbotState = {
        ...chatbotState,
        services: Array.isArray(data.services) ? data.services : [],
        isLoadingServices: false
      };

      hydrateServiceInterestOptions(chatbotState.services);
      renderChatbotPanel();
    } catch (_error) {
      chatbotState = {
        ...chatbotState,
        isLoadingServices: false
      };
      hydrateServiceInterestOptions([]);
      renderChatbotPanel();
    }
  };

  const activateChat = ({ focusInput = true } = {}) => {
    contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    chatbotState = {
      ...chatbotState,
      isActive: true,
      errorMessage: ''
    };
    renderChatbotPanel();
    loadChatbotServices().catch(() => {});

    if (focusInput) {
      window.setTimeout(() => {
        chatMessageInput.focus();
      }, 120);
    }
  };

  const sendChatMessage = async (message) => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || chatbotState.isSending) {
      return;
    }

    chatbotState = {
      ...chatbotState,
      isSending: true,
      errorMessage: '',
      messages: [...chatbotState.messages, { role: 'user', content: trimmedMessage }]
    };

    renderChatbotPanel();
    chatMessageInput.value = '';

    try {
      const response = await fetch(`${apiBaseUrl}/api/chatbot/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: trimmedMessage,
          lead: getLeadPayload(),
          conversation: chatbotState.messages.map(({ role, content }) => ({ role, content })).slice(-10)
        })
      });

      const data = await parseApiResponse(response, 'We could not reach the support assistant right now.');

      chatbotState = {
        ...chatbotState,
        isSending: false,
        messages: [
          ...chatbotState.messages,
          {
            role: 'assistant',
            content: data.reply || 'I can help you with approved Expult service information.',
            matchedServices: Array.isArray(data.matchedServices) ? data.matchedServices : [],
            followUpQuestion: data.followUpQuestion || '',
            leadCapture: data.leadCapture || null
          }
        ]
      };
    } catch (error) {
      chatbotState = {
        ...chatbotState,
        isSending: false,
        errorMessage: error.message || 'We could not reach the support assistant right now.'
      };
    }

    renderChatbotPanel();
  };

  activationButtons.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      activateChat();
    });
  });

  if (hasLeadFields) {
    [chatLeadName, chatLeadEmail, chatLeadCompany].forEach((field) => {
      field.addEventListener('input', syncLeadState);
    });
    chatLeadServiceInterest.addEventListener('change', syncLeadState);
    chatLeadFollowup.addEventListener('change', syncLeadState);
  }

  chatServiceChips.addEventListener('scroll', updateServiceStripControls, { passive: true });
  chatServiceStripPrev.addEventListener('click', () => {
    scrollServiceStrip(-1);
  });
  chatServiceStripNext.addEventListener('click', () => {
    scrollServiceStrip(1);
  });
  window.addEventListener('resize', () => {
    window.requestAnimationFrame(updateServiceStripControls);
  });

  chatPanel.addEventListener('click', (event) => {
    const promptButton = event.target.closest('[data-chat-prompt]');

    if (!promptButton) {
      return;
    }

    const prompt = promptButton.getAttribute('data-chat-prompt') || '';
    if (!chatbotState.isActive) {
      activateChat({ focusInput: false });
    }
    sendChatMessage(prompt).catch(() => {});
  });

  chatComposer.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!chatbotState.isActive) {
      activateChat({ focusInput: false });
    }
    sendChatMessage(chatMessageInput.value).catch(() => {});
  });

  chatRestartButton?.addEventListener('click', () => {
    chatbotState = {
      ...createInitialChatState(),
      isActive: true,
      services: chatbotState.services
    };
    hydrateServiceInterestOptions(chatbotState.services);
    renderChatbotPanel();
    window.setTimeout(() => {
      chatMessageInput.focus();
    }, 80);
  });

  chatCloseButton.addEventListener('click', () => {
    chatbotState = {
      ...chatbotState,
      isActive: false,
      errorMessage: ''
    };
    renderChatbotPanel();
    window.setTimeout(() => {
      primaryChatToggle?.focus();
    }, 180);
  });

  hydrateServiceInterestOptions([]);
  renderChatbotPanel();
  loadChatbotServices().catch(() => {});
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
initializeAboutSection();
initializeRevenueSubsystemSection();
initializeContactForm();
initializeChatbotPanel();
initializeExperienceModal();