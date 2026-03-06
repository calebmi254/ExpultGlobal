const { groqApiKey, groqModel } = require('../config/env');
const { normalizeText } = require('../utils/text');

const automationProfiles = {
  'Car dealership': {
    headline: 'Turn showroom interest into qualified, bookable conversations',
    nextAction: 'Connect inventory inquiries, finance qualification, and test-drive follow-up into one system.',
    outcomes: {
      'More leads': 'Capture more buyer intent from pricing, trade-in, and vehicle availability requests before the visitor leaves.',
      'Faster follow-up': 'Route hot vehicle inquiries to sales immediately so your team responds while buyers are still comparing options.',
      'Better operations': 'Standardize lead intake, qualification notes, and routing so every inquiry reaches the right rep with context.',
      'More bookings': 'Convert interest into booked calls and test drives with automated reminders and rep-ready follow-up.'
    },
    steps: [
      { title: 'Intent captured instantly', copy: 'A visitor asks about stock, pricing, finance, or a trade-in and gets guided instead of abandoned.' },
      { title: 'AI qualifies the buyer', copy: 'The system collects timeline, budget range, vehicle interest, and whether the buyer wants finance support.' },
      { title: 'Lead is routed with context', copy: 'Your team receives a richer lead profile instead of a blank inquiry with no urgency signal.' },
      { title: 'Follow-up keeps momentum', copy: 'Automated messaging keeps the conversation moving toward a call, showroom visit, or test drive.' }
    ]
  },
  Restaurant: {
    headline: 'Convert restaurant interest into reservations, private-event leads, and repeat guests',
    nextAction: 'Connect reservation demand, inquiry response, and guest follow-up so revenue opportunities do not get lost.',
    outcomes: {
      'More leads': 'Capture private dining, catering, and reservation intent the moment visitors land on the site.',
      'Faster follow-up': 'Respond faster to high-intent diners and event inquiries before they choose another venue.',
      'Better operations': 'Reduce manual back-and-forth by structuring booking details and routing them cleanly to staff.',
      'More bookings': 'Move guests from curiosity to confirmed reservation with guided prompts and automated reminders.'
    },
    steps: [
      { title: 'Visitor signals dining intent', copy: 'A guest starts with a reservation, event, menu, or catering question and enters a guided flow.' },
      { title: 'The system gathers context', copy: 'It captures party size, preferred timing, event type, and urgency so your staff starts informed.' },
      { title: 'Team receives qualified demand', copy: 'Restaurant staff see the exact inquiry details instead of chasing missing information.' },
      { title: 'Automated follow-up closes the loop', copy: 'Guests receive timely confirmation, reminders, or next-step messaging that increases completed bookings.' }
    ]
  },
  'Online store': {
    headline: 'Turn browsing and purchase intent into higher-conversion ecommerce follow-up',
    nextAction: 'Connect product questions, purchase intent, and post-visit follow-up into a measurable revenue system.',
    outcomes: {
      'More leads': 'Capture more qualified shoppers through product guidance, bundle suggestions, and checkout-intent prompts.',
      'Faster follow-up': 'Respond to product and purchase questions quickly so buyers stay warm instead of dropping off.',
      'Better operations': 'Organize support, sales, and purchase-intent data so customer conversations are easier to handle.',
      'More bookings': 'Convert high-intent shoppers into consultations, demos, or purchase-completion actions with timed automation.'
    },
    steps: [
      { title: 'Purchase intent is detected', copy: 'The system meets shoppers when they hesitate, ask a question, or explore a high-value product.' },
      { title: 'Smart qualification narrows fit', copy: 'It captures product interest, purchase blockers, and timing so the next response is relevant.' },
      { title: 'Customer data becomes actionable', copy: 'Sales or support receives context-rich lead details instead of anonymous product page visits.' },
      { title: 'Follow-up recovers intent', copy: 'Automation continues the conversation with the right message, sequence, or handoff.' }
    ]
  },
  'Real estate': {
    headline: 'Qualify property inquiries before they slow your team down',
    nextAction: 'Connect listing interest, lead qualification, and appointment scheduling into a faster-moving sales pipeline.',
    outcomes: {
      'More leads': 'Capture more viewing and property inquiries while visitors are actively exploring listings.',
      'Faster follow-up': 'Get hot leads to the right agent faster so the first conversation happens while intent is highest.',
      'Better operations': 'Collect move timeline, property type, financing position, and preferred location automatically.',
      'More bookings': 'Turn listing activity into booked calls and viewings with guided scheduling and reminders.'
    },
    steps: [
      { title: 'Listing interest gets captured', copy: 'A visitor expresses interest in a property, viewing, valuation, or financing conversation.' },
      { title: 'Qualification happens automatically', copy: 'The flow gathers property goals, buying or selling intent, timeframe, and seriousness.' },
      { title: 'Agents receive cleaner leads', copy: 'Your team gets richer context that helps prioritize who needs immediate response.' },
      { title: 'Appointments move forward faster', copy: 'Automation keeps prospects warm with reminders and next-step guidance toward calls or viewings.' }
    ]
  },
  'Service business': {
    headline: 'Transform website traffic into qualified consultation opportunities',
    nextAction: 'Connect inquiry capture, lead qualification, and consultation follow-up into one premium client-acquisition flow.',
    outcomes: {
      'More leads': 'Capture more service inquiries by guiding visitors into a structured, lower-friction conversation.',
      'Faster follow-up': 'Respond quickly to high-intent prospects with context that helps your team move with confidence.',
      'Better operations': 'Reduce manual intake by collecting what the client needs, when they need it, and how urgent it is.',
      'More bookings': 'Convert website intent into booked consultations with guided qualification and automated reminders.'
    },
    steps: [
      { title: 'Visitor asks for help', copy: 'A prospective client starts with a service question and enters a guided qualification flow.' },
      { title: 'Fit and urgency are clarified', copy: 'The system asks structured questions that reveal service need, timeline, and potential value.' },
      { title: 'Qualified leads reach your team', copy: 'You receive leads with business context instead of generic contact requests with no qualification.' },
      { title: 'Automation keeps momentum', copy: 'Follow-up sequences help move prospects toward discovery calls and committed next steps.' }
    ]
  },
  Default: {
    headline: 'Turn website demand into a revenue automation system your team can actually run',
    nextAction: 'Connect lead capture, qualification, routing, follow-up, and booking into one Expult-built revenue workflow.',
    outcomes: {
      'More leads': 'Capture more intent from website visitors before they leave and move qualified opportunities into follow-up automatically.',
      'Faster follow-up': 'Reduce response delays by routing qualified demand instantly and triggering the right follow-up sequence.',
      'Better operations': 'Standardize intake, qualification, routing, and handoff so revenue conversations are handled with less manual work.',
      'More bookings': 'Turn interest into booked calls, demos, or appointments with guided qualification and automated reminders.'
    },
    steps: [
      { title: 'Intent is captured on the site', copy: 'Visitors enter a guided flow that identifies what they need instead of dropping into a generic contact form.' },
      { title: 'Demand gets qualified automatically', copy: 'The system captures fit, urgency, timeline, and commercial intent so the next step is based on real buying context.' },
      { title: 'Opportunities are routed with context', copy: 'Your team receives qualified leads, notes, and priority signals in the right inbox, CRM stage, or pipeline step.' },
      { title: 'Follow-up keeps revenue moving', copy: 'Automated reminders, nurture, and booking handoffs keep high-intent conversations moving toward conversion.' }
    ]
  }
};

const getFallbackOutcome = (priority) => {
  if (!priority) {
    return 'Design an automation system that captures intent, qualifies demand, and routes the best opportunities into follow-up.';
  }

  return `Design an automation system focused on ${priority.toLowerCase()}, with clear qualification, routing, and follow-up built in.`;
};

const normalizePriorities = (value) => {
  const priorities = Array.isArray(value) ? value : typeof value === 'string' ? [value] : [];

  return Array.from(
    new Set(
      priorities
        .map((priority) => normalizeText(priority))
        .filter(Boolean)
    )
  );
};

const formatPriorityFocus = (priorities = []) => {
  if (!priorities.length) {
    return 'revenue automation';
  }

  const loweredPriorities = priorities.map((priority) => priority.toLowerCase());

  if (loweredPriorities.length === 1) {
    return loweredPriorities[0];
  }

  if (loweredPriorities.length === 2) {
    return `${loweredPriorities[0]} and ${loweredPriorities[1]}`;
  }

  return `${loweredPriorities.slice(0, -1).join(', ')}, and ${loweredPriorities[loweredPriorities.length - 1]}`;
};

const buildPriorityOutcome = ({ profile, priorities }) => {
  const outcomeList = priorities
    .map((priority) => profile.outcomes[priority] || getFallbackOutcome(priority))
    .filter(Boolean);

  if (!outcomeList.length) {
    return profile.outcomes['More leads'];
  }

  return Array.from(new Set(outcomeList)).join(' ');
};

const buildAutomationBlueprint = ({ businessType, priority, priorities, businessName }) => {
  const profile = automationProfiles[businessType] || automationProfiles.Default;
  const businessLabel = businessName || businessType;
  const normalizedPriorities = normalizePriorities(priorities?.length ? priorities : priority);
  const outcome = buildPriorityOutcome({ profile, priorities: normalizedPriorities });
  const focusLabel = formatPriorityFocus(normalizedPriorities);

  return {
    title: `${businessLabel} Automation Blueprint`,
    headline: profile.headline,
    summary: `For ${businessLabel}, Expult would guide visitors through a qualification flow focused on ${focusLabel}. ${outcome}`,
    outcome,
    nextAction: profile.nextAction,
    steps: profile.steps,
    ctaLabel: 'Talk to Expult About This Blueprint'
  };
};

const normalizeBlueprint = (candidate, fallback) => {
  const fallbackSteps = Array.isArray(fallback.steps) ? fallback.steps : [];
  const candidateSteps = Array.isArray(candidate?.steps) ? candidate.steps : [];
  const steps = (candidateSteps.length ? candidateSteps : fallbackSteps).slice(0, 4).map((step, index) => ({
    title: normalizeText(step?.title) || fallbackSteps[index]?.title || `Step ${index + 1}`,
    copy: normalizeText(step?.copy) || fallbackSteps[index]?.copy || 'Details will be refined during implementation.'
  }));

  return {
    title: normalizeText(candidate?.title) || fallback.title,
    headline: normalizeText(candidate?.headline) || fallback.headline,
    summary: normalizeText(candidate?.summary) || fallback.summary,
    outcome: normalizeText(candidate?.outcome) || fallback.outcome,
    nextAction: normalizeText(candidate?.nextAction) || fallback.nextAction,
    steps: steps.length ? steps : fallbackSteps,
    ctaLabel: normalizeText(candidate?.ctaLabel) || fallback.ctaLabel
  };
};

const extractJsonObject = (value) => {
  const content = normalizeText(value);
  const start = content.indexOf('{');
  const end = content.lastIndexOf('}');

  if (start === -1 || end === -1 || end <= start) {
    return null;
  }

  return content.slice(start, end + 1);
};

const groqBlueprintSystemPrompt =
  'You generate premium automation blueprints for Expult Global. Expult sells and implements revenue automation systems it can actually build for clients, including website lead capture, lead qualification, routing, booking, CRM handoff, pipeline follow-up, reactivation, and conversion workflows. Use only facts explicitly provided in the input lead object plus broad, generic language that is inherently true of the selected business type. Do not invent location, neighborhood, city, region, company size, customer demographics, years in business, market position, inventory scale, number of branches, or any other unprovided specifics. If a detail was not provided, keep it generic. Do not recommend generic analytics dashboards, reporting tools, commodity SaaS, or tools such as Google Analytics as the core solution. If you mention third-party tools, frame them only as supporting integrations inside an Expult-built revenue automation system. Return only valid JSON with keys: title, headline, summary, outcome, nextAction, steps, ctaLabel. The steps field must be an array of exactly 4 objects with title and copy. Keep content specific, realistic, concise, and implementation-oriented.';

const groqBlueprintRequirements = [
  'Use the business name in the title when possible.',
  'Make the headline and summary specific to the business type and selected priorities.',
  'Describe the primary outcome as a measurable business improvement tied to revenue capture, conversion speed, booking rate, or sales efficiency.',
  'Set the next action as what Expult would build, connect, or automate next.',
  'Make each step feel like a real revenue automation flow from website visitor intent to qualification, routing, follow-up, booking, or conversion.',
  'Keep the blueprint anchored to systems Expult can actually build, such as lead capture, qualification, routing, nurture, CRM/pipeline handoff, appointment scheduling, or reactivation workflows.',
  'Only use facts present in the provided lead object and avoid introducing any unprovided business claims.',
  'Do not invent or imply a location, neighborhood, market, customer segment, premium positioning, company size, or other unsupported specifics.',
  'Avoid phrases such as "in the heart of the city," "local favorite," "multi-location," or any similar detail unless it was explicitly provided.',
  'Do not recommend dashboards, analytics-only setups, generic reporting, or commodity tools such as Google Analytics as the main solution.',
  'Only mention external tools when they support the automation system rather than replace Expult\'s service.',
  'Do not mention that this was generated by AI.'
];

const requestGroqBlueprint = async ({ name, email, businessName, businessType, priority, priorities }) => {
  const normalizedPriorities = normalizePriorities(priorities?.length ? priorities : priority);
  const fallbackBlueprint = buildAutomationBlueprint({
    businessType,
    priority,
    priorities: normalizedPriorities,
    businessName
  });

  if (!groqApiKey) {
    return {
      blueprint: fallbackBlueprint,
      provider: 'fallback',
      model: 'static-blueprint'
    };
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${groqApiKey}`
      },
      body: JSON.stringify({
        model: groqModel,
        temperature: 0.2,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: groqBlueprintSystemPrompt },
          {
            role: 'user',
            content: JSON.stringify({
              company: 'Expult Global',
              serviceOffering: {
                name: 'Revenue automation systems',
                scope: [
                  'capture website visitor intent before it is lost',
                  'qualify demand with structured questions',
                  'route hot opportunities to the right team member',
                  'trigger timely follow-up, nurture, reminders, and reactivation',
                  'connect bookings, CRM updates, and pipeline handoff to conversion outcomes'
                ],
                avoid: [
                  'analytics dashboards as the main recommendation',
                  'generic reporting setups as the solution',
                  'commodity tools such as Google Analytics positioned as the core answer'
                ]
              },
              lead: {
                name,
                email,
                businessName,
                businessType,
                priorities: normalizedPriorities,
                primaryPriority: normalizedPriorities[0] || ''
              },
              instructions: {
                audience: 'a business owner or operator evaluating automation services',
                tone: 'premium, practical, clear, realistic',
                requirements: groqBlueprintRequirements
              }
            })
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Groq request failed (${response.status}): ${errorText}`);
    }

    const completion = await response.json();
    const content = completion?.choices?.[0]?.message?.content;
    const jsonPayload = extractJsonObject(content);

    if (!jsonPayload) {
      throw new Error('Groq response did not contain a valid JSON object.');
    }

    return {
      blueprint: normalizeBlueprint(JSON.parse(jsonPayload), fallbackBlueprint),
      provider: 'groq',
      model: groqModel
    };
  } catch (error) {
    console.error('Groq blueprint generation failed. Falling back to static blueprint.', error);

    return {
      blueprint: fallbackBlueprint,
      provider: 'fallback',
      model: 'static-blueprint'
    };
  }
};

module.exports = {
  requestGroqBlueprint
};