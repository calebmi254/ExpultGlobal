const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { MongoClient, ObjectId } = require('mongodb');
const { Resend } = require('resend');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const mongoUri = process.env.MONGODB_URI;
const mongoDatabaseName = process.env.MONGODB_DB_NAME || 'expult_global';
const contactCollectionName = process.env.MONGODB_CONTACT_COLLECTION || 'contact_requests';
const simulationCollectionName = process.env.MONGODB_SIMULATION_COLLECTION || 'automation_test_drive_leads';

const resendApiKey = process.env.RESEND_API_KEY;
const resendFromEmail = process.env.RESEND_FROM_EMAIL || 'Expult Global <onboarding@resend.dev>';
const resendReplyToEmail = process.env.RESEND_REPLY_TO_EMAIL;
const adminNotificationEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
const groqApiKey = process.env.GROQ_API_KEY;
const groqModel = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';

const resend = resendApiKey ? new Resend(resendApiKey) : null;
const contactRequests = [];
const simulationRequests = [];
let databasePromise = null;
let mongoClient = null;

const businessTypes = ['Car dealership', 'Restaurant', 'Online store', 'Real estate', 'Service business'];
const priorities = ['More leads', 'Faster follow-up', 'Better operations', 'More bookings'];

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
      {
        title: 'Intent captured instantly',
        copy: 'A visitor asks about stock, pricing, finance, or a trade-in and gets guided instead of abandoned.'
      },
      {
        title: 'AI qualifies the buyer',
        copy: 'The system collects timeline, budget range, vehicle interest, and whether the buyer wants finance support.'
      },
      {
        title: 'Lead is routed with context',
        copy: 'Your team receives a richer lead profile instead of a blank inquiry with no urgency signal.'
      },
      {
        title: 'Follow-up keeps momentum',
        copy: 'Automated messaging keeps the conversation moving toward a call, showroom visit, or test drive.'
      }
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
      {
        title: 'Visitor signals dining intent',
        copy: 'A guest starts with a reservation, event, menu, or catering question and enters a guided flow.'
      },
      {
        title: 'The system gathers context',
        copy: 'It captures party size, date, event type, location, and urgency so your staff starts informed.'
      },
      {
        title: 'Team receives qualified demand',
        copy: 'Restaurant staff see the exact inquiry details instead of chasing missing information.'
      },
      {
        title: 'Automated follow-up closes the loop',
        copy: 'Guests receive timely confirmation, reminders, or next-step messaging that increases completed bookings.'
      }
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
      {
        title: 'Purchase intent is detected',
        copy: 'The system meets shoppers when they hesitate, ask a question, or explore a high-value product.'
      },
      {
        title: 'Smart qualification narrows fit',
        copy: 'It captures product interest, purchase blockers, and timing so the next response is relevant.'
      },
      {
        title: 'Customer data becomes actionable',
        copy: 'Sales or support receives context-rich lead details instead of anonymous product page visits.'
      },
      {
        title: 'Follow-up recovers intent',
        copy: 'Automation continues the conversation with the right message, sequence, or handoff.'
      }
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
      {
        title: 'Listing interest gets captured',
        copy: 'A visitor expresses interest in a property, viewing, valuation, or financing conversation.'
      },
      {
        title: 'Qualification happens automatically',
        copy: 'The flow gathers property goals, buying or selling intent, timeframe, and seriousness.'
      },
      {
        title: 'Agents receive cleaner leads',
        copy: 'Your team gets richer context that helps prioritize who needs immediate response.'
      },
      {
        title: 'Appointments move forward faster',
        copy: 'Automation keeps prospects warm with reminders and next-step guidance toward calls or viewings.'
      }
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
      {
        title: 'Visitor asks for help',
        copy: 'A prospective client starts with a service question and enters a guided qualification flow.'
      },
      {
        title: 'Fit and urgency are clarified',
        copy: 'The system asks structured questions that reveal service need, timeline, and potential value.'
      },
      {
        title: 'Qualified leads reach your team',
        copy: 'You receive leads with business context instead of generic contact requests with no qualification.'
      },
      {
        title: 'Automation keeps momentum',
        copy: 'Follow-up sequences help move prospects toward discovery calls and committed next steps.'
      }
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
      {
        title: 'Intent is captured on the site',
        copy: 'Visitors enter a guided flow that identifies what they need instead of dropping into a generic contact form.'
      },
      {
        title: 'Demand gets qualified automatically',
        copy: 'The system captures fit, urgency, timeline, and commercial intent so the next step is based on real buying context.'
      },
      {
        title: 'Opportunities are routed with context',
        copy: 'Your team receives qualified leads, notes, and priority signals in the right inbox, CRM stage, or pipeline step.'
      },
      {
        title: 'Follow-up keeps revenue moving',
        copy: 'Automated reminders, nurture, and booking handoffs keep high-intent conversations moving toward conversion.'
      }
    ]
  }
};

app.use(cors());
app.use(express.json({ limit: '1mb' }));

const normalizeText = (value) => (typeof value === 'string' ? value.trim() : '');

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const isValidEmail = (value) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value);

const isValidObjectId = (value) => typeof value === 'string' && ObjectId.isValid(value);

const getRecordObjectId = (value) => (isValidObjectId(value) ? new ObjectId(value) : null);

const serializeSimulationLead = (record) => {
  if (!record) {
    return null;
  }

  return {
    draftId: record._id ? record._id.toString() : String(record.id),
    status: record.status || 'draft',
    name: record.name || '',
    email: record.email || '',
    businessName: record.businessName || '',
    businessType: record.businessType || '',
    priority: record.priority || '',
    blueprint: record.blueprint || null,
    lastCompletedStep: Number(record.lastCompletedStep || 1),
    createdAt: record.createdAt || null,
    updatedAt: record.updatedAt || record.createdAt || null,
    completedAt: record.completedAt || null
  };
};

const getFallbackOutcome = (priority) => {
  if (!priority) {
    return 'Design an automation system that captures intent, qualifies demand, and routes the best opportunities into follow-up.';
  }

  return `Design an automation system focused on ${priority.toLowerCase()}, with clear qualification, routing, and follow-up built in.`;
};

const getDatabase = async () => {
  if (!mongoUri) {
    return null;
  }

  if (!databasePromise) {
    mongoClient = new MongoClient(mongoUri);
    databasePromise = mongoClient
      .connect()
      .then((client) => {
        console.log(`MongoDB connected for Expult Global (${mongoDatabaseName}).`);
        return client.db(mongoDatabaseName);
      })
      .catch((error) => {
        console.error('MongoDB connection failed. Falling back to in-memory storage.', error);
        databasePromise = null;
        mongoClient = null;
        return null;
      });
  }

  return databasePromise;
};

const saveRecord = async (collectionName, record, fallbackArray) => {
  const database = await getDatabase();

  if (database) {
    const result = await database.collection(collectionName).insertOne(record);

    return {
      storage: 'mongodb',
      id: result.insertedId.toString()
    };
  }

  fallbackArray.push({
    ...record,
    id: fallbackArray.length + 1
  });

  return {
    storage: 'memory',
    id: String(fallbackArray.length)
  };
};

const getRecordById = async (collectionName, recordId, fallbackArray) => {
  const database = await getDatabase();

  if (database) {
    const objectId = getRecordObjectId(recordId);

    if (!objectId) {
      return null;
    }

    return database.collection(collectionName).findOne({ _id: objectId });
  }

  return fallbackArray.find((record) => String(record.id) === String(recordId)) || null;
};

const updateRecordById = async (collectionName, recordId, updates, fallbackArray) => {
  const database = await getDatabase();

  if (database) {
    const objectId = getRecordObjectId(recordId);

    if (!objectId) {
      return null;
    }

    const collection = database.collection(collectionName);
    const result = await collection.findOneAndUpdate(
      { _id: objectId },
      { $set: updates },
      { returnDocument: 'after' }
    );

    return result || null;
  }

  const recordIndex = fallbackArray.findIndex((record) => String(record.id) === String(recordId));

  if (recordIndex === -1) {
    return null;
  }

  fallbackArray[recordIndex] = {
    ...fallbackArray[recordIndex],
    ...updates
  };

  return fallbackArray[recordIndex];
};

const sendEmailIfConfigured = async ({ to, subject, html, replyTo }) => {
  if (!resend || !to) {
    return { skipped: true };
  }

  try {
    await resend.emails.send({
      from: resendFromEmail,
      to,
      replyTo: replyTo || resendReplyToEmail,
      subject,
      html
    });

    return { sent: true };
  } catch (error) {
    console.error(`Resend email failed for ${subject}.`, error);

    return {
      sent: false,
      error: error.message
    };
  }
};

const renderEmailList = (items) =>
  items.map((item) => `<li style="margin-bottom:8px;">${item}</li>`).join('');

const buildAutomationBlueprint = ({ businessType, priority, businessName }) => {
  const profile = automationProfiles[businessType] || automationProfiles.Default;
  const businessLabel = businessName || businessType;
  const outcome = profile.outcomes[priority] || getFallbackOutcome(priority) || profile.outcomes['More leads'];

  return {
    title: `${businessLabel} Automation Blueprint`,
    headline: profile.headline,
    summary: `For ${businessLabel}, Expult would guide visitors through a qualification flow focused on ${priority.toLowerCase()}. ${outcome}`,
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
  'You generate premium automation blueprints for Expult Global. Expult sells and implements revenue automation systems it can actually build for clients, including website lead capture, lead qualification, routing, booking, CRM handoff, pipeline follow-up, reactivation, and conversion workflows. Do not recommend generic analytics dashboards, reporting tools, commodity SaaS, or tools such as Google Analytics as the core solution. If you mention third-party tools, frame them only as supporting integrations inside an Expult-built revenue automation system. Return only valid JSON with keys: title, headline, summary, outcome, nextAction, steps, ctaLabel. The steps field must be an array of exactly 4 objects with title and copy. Keep content specific, realistic, concise, and implementation-oriented.';

const groqBlueprintRequirements = [
  'Use the business name in the title when possible.',
  'Make the headline and summary specific to the business type and growth priority.',
  'Describe the primary outcome as a measurable business improvement tied to revenue capture, conversion speed, booking rate, or sales efficiency.',
  'Set the next action as what Expult would build, connect, or automate next.',
  'Make each step feel like a real revenue automation flow from website visitor intent to qualification, routing, follow-up, booking, or conversion.',
  'Keep the blueprint anchored to systems Expult can actually build, such as lead capture, qualification, routing, nurture, CRM/pipeline handoff, appointment scheduling, or reactivation workflows.',
  'Do not recommend dashboards, analytics-only setups, generic reporting, or commodity tools such as Google Analytics as the main solution.',
  'Only mention external tools when they support the automation system rather than replace Expult\'s service.',
  'Do not mention that this was generated by AI.'
];

const requestGroqBlueprint = async ({ name, email, businessName, businessType, priority }) => {
  const fallbackBlueprint = buildAutomationBlueprint({ businessType, priority, businessName });

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
        temperature: 0.4,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: groqBlueprintSystemPrompt
          },
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
                priority
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

const getLastCompletedStep = ({ blueprint, priority, businessType }) => {
  if (blueprint) {
    return 4;
  }

  if (priority) {
    return 3;
  }

  if (businessType) {
    return 2;
  }

  return 1;
};

const buildContactAdminEmail = (payload) => `
  <div style="font-family:Arial,sans-serif;color:#151110;line-height:1.6;">
    <h2 style="margin-bottom:12px;">New Expult Global contact request</h2>
    <ul>
      ${renderEmailList([
        `<strong>Name:</strong> ${escapeHtml(payload.name)}`,
        `<strong>Email:</strong> ${escapeHtml(payload.email)}`,
        `<strong>Company:</strong> ${escapeHtml(payload.company)}`,
        `<strong>Team type:</strong> ${escapeHtml(payload.teamType)}`,
        `<strong>Submitted:</strong> ${escapeHtml(payload.createdAt)}`
      ])}
    </ul>
    <p><strong>Message</strong></p>
    <p>${escapeHtml(payload.message)}</p>
  </div>
`;

const buildContactCustomerEmail = (payload) => `
  <div style="font-family:Arial,sans-serif;color:#151110;line-height:1.6;">
    <h2 style="margin-bottom:12px;">We received your Expult Global inquiry</h2>
    <p>Hi ${escapeHtml(payload.name)},</p>
    <p>Thanks for reaching out to Expult Global. We received your message and will review your request shortly.</p>
    <p><strong>Your focus:</strong> ${escapeHtml(payload.message)}</p>
    <p>We will follow up using the details you submitted for ${escapeHtml(payload.company)}.</p>
  </div>
`;

const buildSimulationAdminEmail = (payload) => `
  <div style="font-family:Arial,sans-serif;color:#151110;line-height:1.6;">
    <h2 style="margin-bottom:12px;">New automation test drive lead</h2>
    <ul>
      ${renderEmailList([
        `<strong>Name:</strong> ${escapeHtml(payload.name)}`,
        `<strong>Email:</strong> ${escapeHtml(payload.email)}`,
        `<strong>Business name:</strong> ${escapeHtml(payload.businessName)}`,
        `<strong>Business type:</strong> ${escapeHtml(payload.businessType)}`,
        `<strong>Priority:</strong> ${escapeHtml(payload.priority)}`,
        `<strong>Lead source:</strong> ${escapeHtml(payload.source)}`,
        `<strong>Submitted:</strong> ${escapeHtml(payload.createdAt)}`
      ])}
    </ul>
    <p><strong>Blueprint outcome</strong></p>
    <p>${escapeHtml(payload.blueprint.outcome)}</p>
  </div>
`;

const buildSimulationCustomerEmail = (payload) => `
  <div style="font-family:Arial,sans-serif;color:#151110;line-height:1.6;">
    <h2 style="margin-bottom:12px;">Your Expult automation blueprint is ready</h2>
    <p>Hi ${escapeHtml(payload.name)},</p>
    <p>Thanks for taking the Expult Automation Test Drive for ${escapeHtml(payload.businessName)}.</p>
    <p><strong>Priority selected:</strong> ${escapeHtml(payload.priority)}</p>
    <p><strong>Blueprint direction:</strong> ${escapeHtml(payload.blueprint.outcome)}</p>
    <p>${escapeHtml(payload.blueprint.nextAction)}</p>
  </div>
`;

app.get('/', (_req, res) => {
  res.json({
    company: 'Expult Global',
    message: 'Welcome to the Expult Global backend API.'
  });
});

app.get('/api/health', async (_req, res) => {
  const database = await getDatabase();

  res.json({
    status: 'ok',
    company: 'Expult Global',
    message: 'Express backend is running',
    integrations: {
      mongodbConfigured: Boolean(mongoUri),
      mongodbConnected: Boolean(database),
      resendConfigured: Boolean(resendApiKey),
      adminNotificationConfigured: Boolean(adminNotificationEmail)
    }
  });
});

app.get('/api/company', (_req, res) => {
  res.json({
    name: 'Expult Global',
    stage: 'Lead capture foundation active',
    nextStep: 'Drive traffic through the automation experience'
  });
});

app.post('/api/contact', async (req, res, next) => {
  try {
    const name = normalizeText(req.body.name);
    const email = normalizeText(req.body.email);
    const company = normalizeText(req.body.company);
    const teamType = normalizeText(req.body.teamType);
    const message = normalizeText(req.body.message);

    if (!name || !email || !company || !teamType || !message) {
      return res.status(400).json({
        status: 'error',
        message: 'Please complete all contact form fields before submitting.'
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        status: 'error',
        message: 'Please enter a valid email address before submitting.'
      });
    }

    const contactRequest = {
      source: 'website_contact_modal',
      name,
      email,
      company,
      teamType,
      message,
      createdAt: new Date().toISOString()
    };

    const saveResult = await saveRecord(contactCollectionName, contactRequest, contactRequests);

    console.log(`New Expult Global contact request saved to ${saveResult.storage}.`, {
      id: saveResult.id,
      email,
      teamType
    });

    await Promise.allSettled([
      adminNotificationEmail
        ? sendEmailIfConfigured({
            to: adminNotificationEmail,
            subject: `New Expult inquiry from ${name}`,
            html: buildContactAdminEmail(contactRequest),
            replyTo: email
          })
        : Promise.resolve({ skipped: true }),
      sendEmailIfConfigured({
        to: email,
        subject: 'We received your Expult Global request',
        html: buildContactCustomerEmail(contactRequest)
      })
    ]);

    return res.status(201).json({
      status: 'ok',
      message: 'Thanks — your request has been received. We will follow up shortly.'
    });
  } catch (error) {
    return next(error);
  }
});

app.post('/api/automation-test-drive/draft', async (req, res, next) => {
  try {
    const name = normalizeText(req.body.name);
    const email = normalizeText(req.body.email);
    const businessName = normalizeText(req.body.businessName);

    if (!name || !email || !businessName) {
      return res.status(400).json({
        status: 'error',
        message: 'Provide your name, email, and business name before continuing.'
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        status: 'error',
        message: 'Please enter a valid email address before continuing.'
      });
    }

    const createdAt = new Date().toISOString();
    const simulationLeadDraft = {
      source: 'website_simulation',
      status: 'draft',
      name,
      email,
      businessName,
      businessType: '',
      priority: '',
      blueprint: null,
      createdAt,
      updatedAt: createdAt,
      completedAt: null,
      lastCompletedStep: 1
    };

    const saveResult = await saveRecord(simulationCollectionName, simulationLeadDraft, simulationRequests);

    console.log(`Automation test drive draft saved to ${saveResult.storage}.`, {
      id: saveResult.id,
      email,
      businessName,
      status: 'draft'
    });

    return res.status(201).json({
      status: 'ok',
      message: 'Your details have been saved.',
      draft: {
        ...serializeSimulationLead(simulationLeadDraft),
        draftId: saveResult.id
      }
    });
  } catch (error) {
    return next(error);
  }
});

app.get('/api/automation-test-drive/draft/:draftId', async (req, res, next) => {
  try {
    const draft = await getRecordById(simulationCollectionName, req.params.draftId, simulationRequests);

    if (!draft) {
      return res.status(404).json({
        status: 'error',
        message: 'Saved automation draft not found.'
      });
    }

    return res.json({
      status: 'ok',
      draft: serializeSimulationLead(draft)
    });
  } catch (error) {
    return next(error);
  }
});

app.patch('/api/automation-test-drive/draft/:draftId', async (req, res, next) => {
  try {
    const existingDraft = await getRecordById(simulationCollectionName, req.params.draftId, simulationRequests);

    if (!existingDraft) {
      return res.status(404).json({
        status: 'error',
        message: 'Saved automation draft not found.'
      });
    }

    const updates = {};
    const nameProvided = Object.prototype.hasOwnProperty.call(req.body, 'name');
    const emailProvided = Object.prototype.hasOwnProperty.call(req.body, 'email');
    const businessNameProvided = Object.prototype.hasOwnProperty.call(req.body, 'businessName');
    const businessTypeProvided = Object.prototype.hasOwnProperty.call(req.body, 'businessType');
    const priorityProvided = Object.prototype.hasOwnProperty.call(req.body, 'priority');

    if (!nameProvided && !emailProvided && !businessNameProvided && !businessTypeProvided && !priorityProvided) {
      return res.status(400).json({
        status: 'error',
        message: 'No draft fields were provided to update.'
      });
    }

    if (nameProvided) {
      const name = normalizeText(req.body.name);

      if (!name) {
        return res.status(400).json({
          status: 'error',
          message: 'Name cannot be empty.'
        });
      }

      updates.name = name;
    }

    if (emailProvided) {
      const email = normalizeText(req.body.email);

      if (!email || !isValidEmail(email)) {
        return res.status(400).json({
          status: 'error',
          message: 'Please provide a valid email address.'
        });
      }

      updates.email = email;
    }

    if (businessNameProvided) {
      const businessName = normalizeText(req.body.businessName);

      if (!businessName) {
        return res.status(400).json({
          status: 'error',
          message: 'Business name cannot be empty.'
        });
      }

      updates.businessName = businessName;
    }

    if (businessTypeProvided) {
      const businessType = normalizeText(req.body.businessType);

      if (!businessType) {
        return res.status(400).json({
          status: 'error',
          message: 'Business type cannot be empty.'
        });
      }

      updates.businessType = businessType;
    }

    if (priorityProvided) {
      const priority = normalizeText(req.body.priority);

      if (!priority) {
        return res.status(400).json({
          status: 'error',
          message: 'Priority cannot be empty.'
        });
      }

      updates.priority = priority;
    }

    const mergedDraft = {
      ...existingDraft,
      ...updates
    };

    updates.updatedAt = new Date().toISOString();
    updates.status = existingDraft.status || 'draft';
    updates.lastCompletedStep = getLastCompletedStep(mergedDraft);

    const updatedDraft = await updateRecordById(
      simulationCollectionName,
      req.params.draftId,
      updates,
      simulationRequests
    );

    return res.json({
      status: 'ok',
      message: 'Your saved automation draft has been updated.',
      draft: serializeSimulationLead(updatedDraft)
    });
  } catch (error) {
    return next(error);
  }
});

app.post('/api/automation-test-drive', async (req, res, next) => {
  try {
    const draftId = normalizeText(req.body.draftId);
    const name = normalizeText(req.body.name);
    const email = normalizeText(req.body.email);
    const businessName = normalizeText(req.body.businessName);
    const businessType = normalizeText(req.body.businessType);
    const priority = normalizeText(req.body.priority);

    if (!name || !email || !businessName || !businessType || !priority) {
      return res.status(400).json({
        status: 'error',
        message: 'Complete each step before generating your automation blueprint.'
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        status: 'error',
        message: 'Please enter a valid email address to receive your blueprint.'
      });
    }

    const draftRecord = draftId
      ? await getRecordById(simulationCollectionName, draftId, simulationRequests)
      : null;

    if (draftId && !draftRecord) {
      return res.status(404).json({
        status: 'error',
        message: 'The saved automation draft could not be found. Please restart the experience.'
      });
    }

    const blueprintResult = await requestGroqBlueprint({
      name,
      email,
      businessName,
      businessType,
      priority
    });

    const blueprint = blueprintResult.blueprint;
    const completedAt = new Date().toISOString();

    const simulationLead = {
      source: 'website_simulation',
      status: 'completed',
      name,
      email,
      businessName,
      businessType,
      priority,
      blueprint,
      updatedAt: completedAt,
      completedAt,
      blueprintProvider: blueprintResult.provider,
      blueprintModel: blueprintResult.model,
      lastCompletedStep: 4
    };

    let savedRecordId = draftId;

    if (draftRecord) {
      const updatedLead = await updateRecordById(simulationCollectionName, draftId, simulationLead, simulationRequests);

      if (!updatedLead) {
        return res.status(404).json({
          status: 'error',
          message: 'The saved automation draft could not be updated. Please restart the experience.'
        });
      }
    } else {
      simulationLead.createdAt = completedAt;
      const saveResult = await saveRecord(simulationCollectionName, simulationLead, simulationRequests);
      savedRecordId = saveResult.id;
    }

    console.log('Automation test drive blueprint generated.', {
      id: savedRecordId,
      email,
      businessType,
      priority,
      provider: blueprintResult.provider,
      model: blueprintResult.model
    });

    await Promise.allSettled([
      adminNotificationEmail
        ? sendEmailIfConfigured({
            to: adminNotificationEmail,
            subject: `Automation Test Drive lead: ${businessName}`,
            html: buildSimulationAdminEmail(simulationLead),
            replyTo: email
          })
        : Promise.resolve({ skipped: true }),
      sendEmailIfConfigured({
        to: email,
        subject: 'Your Expult automation blueprint is ready',
        html: buildSimulationCustomerEmail(simulationLead)
      })
    ]);

    return res.status(201).json({
      status: 'ok',
      message: 'Your automation blueprint is ready.',
      draftId: savedRecordId,
      blueprint,
      provider: blueprintResult.provider,
      model: blueprintResult.model
    });
  } catch (error) {
    return next(error);
  }
});

app.use((_req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found'
  });
});

app.use((error, _req, res, _next) => {
  console.error('Unexpected Expult Global backend error.', error);

  res.status(500).json({
    status: 'error',
    message: 'An unexpected server error occurred. Please try again shortly.'
  });
});

const server = app.listen(PORT, () => {
  console.log(`Expult Global backend running on http://localhost:${PORT}`);
});

const closeResources = async () => {
  if (mongoClient) {
    await mongoClient.close();
  }
};

const shutdown = async (signal) => {
  console.log(`${signal} received. Shutting down Expult Global backend.`);
  await closeResources();
  server.close(() => process.exit(0));
};

['SIGINT', 'SIGTERM'].forEach((signal) => {
  process.on(signal, () => {
    shutdown(signal).catch((error) => {
      console.error('Error during shutdown.', error);
      process.exit(1);
    });
  });
});