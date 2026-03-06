const {
  simulationCollectionName,
  adminNotificationEmail,
  hotLeadNotificationEmail
} = require('../config/env');
const { saveRecord, getRecordById, updateRecordById } = require('../config/database');
const { sendEmailIfConfigured } = require('../config/email');
const {
  buildSimulationAdminEmail,
  buildSimulationCustomerEmail,
  buildSimulationHotLeadEmail
} = require('./automation-email.service');
const { requestGroqBlueprint } = require('./automation-blueprint.service');

const simulationRequests = [];

const normalizePriorityValues = (value) => {
  const priorities = Array.isArray(value) ? value : typeof value === 'string' ? [value] : [];

  return Array.from(
    new Set(
      priorities
        .map((priority) => String(priority || '').trim())
        .filter(Boolean)
    )
  );
};

const getStoredPriorities = (record) =>
  normalizePriorityValues(
    Array.isArray(record?.priorities) && record.priorities.length ? record.priorities : record?.priority
  );

const formatPrioritySummary = (priorities) => normalizePriorityValues(priorities).join(', ');

const getStoredReenteredEmail = (record) =>
  String(record?.reenteredEmail || record?.reconfirmedEmail || '').trim();

const getConfirmedContactEmail = (record) => getStoredReenteredEmail(record) || String(record?.email || '').trim();

const serializeSimulationLead = (record) => {
  if (!record) {
    return null;
  }

  const priorities = getStoredPriorities(record);
  const reenteredEmail = getStoredReenteredEmail(record);

  return {
    draftId: record._id ? record._id.toString() : String(record.id),
    status: record.status || 'draft',
    name: record.name || '',
    email: record.email || '',
    businessName: record.businessName || '',
    businessType: record.businessType || '',
    priority: formatPrioritySummary(priorities),
    priorities,
    blueprint: record.blueprint || null,
    reenteredEmail,
    reconfirmedEmail: reenteredEmail,
    confirmedContactEmail: getConfirmedContactEmail(record),
    confirmedEmailSource: record.confirmedEmailSource || '',
    hotLead: Boolean(record.hotLead),
    leadTemperature: record.leadTemperature || 'warm',
    appointmentRequestedAt: record.appointmentRequestedAt || null,
    lastCompletedStep: Number(record.lastCompletedStep || 1),
    createdAt: record.createdAt || null,
    updatedAt: record.updatedAt || record.createdAt || null,
    completedAt: record.completedAt || null
  };
};

const getLastCompletedStep = ({ blueprint, priorities, priority, businessType }) => {
  if (blueprint) {
    return 4;
  }

  if (getStoredPriorities({ priorities, priority }).length) {
    return 3;
  }

  if (businessType) {
    return 2;
  }

  return 1;
};

const saveAutomationRecord = async (record) => saveRecord(simulationCollectionName, record, simulationRequests);

const getAutomationRecordById = async (recordId) => getRecordById(simulationCollectionName, recordId, simulationRequests);

const updateAutomationRecord = async (recordId, updates) =>
  updateRecordById(simulationCollectionName, recordId, updates, simulationRequests);

const createAutomationDraft = async ({ name, email, businessName }) => {
  const createdAt = new Date().toISOString();
  const simulationLeadDraft = {
    source: 'website_simulation',
    status: 'draft',
    name,
    email,
    businessName,
    businessType: '',
    priorities: [],
    priority: '',
    blueprint: null,
    reenteredEmail: '',
    reconfirmedEmail: '',
    confirmedEmailSource: '',
    hotLead: false,
    leadTemperature: 'warm',
    appointmentRequestedAt: null,
    createdAt,
    updatedAt: createdAt,
    completedAt: null,
    lastCompletedStep: 1
  };

  const saveResult = await saveAutomationRecord(simulationLeadDraft);

  console.log(`Automation test drive draft saved to ${saveResult.storage}.`, {
    id: saveResult.id,
    email,
    businessName,
    status: 'draft'
  });

  return {
    saveResult,
    draft: {
      ...serializeSimulationLead(simulationLeadDraft),
      draftId: saveResult.id
    }
  };
};

const updateAutomationDraftFields = async (draftId, updates) => {
  const existingDraft = await getAutomationRecordById(draftId);

  if (!existingDraft) {
    return null;
  }

  const mergedDraft = {
    ...existingDraft,
    ...updates
  };

  const persistedUpdates = {
    ...updates,
    updatedAt: new Date().toISOString(),
    status: existingDraft.status || 'draft',
    lastCompletedStep: getLastCompletedStep(mergedDraft)
  };

  const updatedDraft = await updateAutomationRecord(draftId, persistedUpdates);

  return updatedDraft ? serializeSimulationLead(updatedDraft) : null;
};

const completeAutomationExperience = async ({ draftId, name, email, businessName, businessType, priority, priorities }) => {
  const draftRecord = draftId ? await getAutomationRecordById(draftId) : null;
  const normalizedPriorities = normalizePriorityValues(priorities?.length ? priorities : priority);

  if (draftId && !draftRecord) {
    return { status: 'draft_not_found' };
  }

  const blueprintResult = await requestGroqBlueprint({
    name,
    email,
    businessName,
    businessType,
    priority,
    priorities: normalizedPriorities
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
    priorities: normalizedPriorities,
    priority: formatPrioritySummary(normalizedPriorities),
    blueprint,
    reenteredEmail: draftRecord?.reenteredEmail || draftRecord?.reconfirmedEmail || '',
    reconfirmedEmail: draftRecord?.reconfirmedEmail || '',
    confirmedEmailSource: draftRecord?.confirmedEmailSource || '',
    hotLead: Boolean(draftRecord?.hotLead),
    leadTemperature: draftRecord?.leadTemperature || 'warm',
    appointmentRequestedAt: draftRecord?.appointmentRequestedAt || null,
    updatedAt: completedAt,
    completedAt,
    blueprintProvider: blueprintResult.provider,
    blueprintModel: blueprintResult.model,
    lastCompletedStep: 4
  };

  let savedRecordId = draftId;

  if (draftRecord) {
    const updatedLead = await updateAutomationRecord(draftId, simulationLead);

    if (!updatedLead) {
      return { status: 'draft_update_failed' };
    }
  } else {
    simulationLead.createdAt = completedAt;
    const saveResult = await saveAutomationRecord(simulationLead);
    savedRecordId = saveResult.id;
  }

  console.log('Automation test drive blueprint generated.', {
    id: savedRecordId,
    email,
    businessType,
    priorities: normalizedPriorities,
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

  return {
    status: 'ok',
    draftId: savedRecordId,
    blueprint,
    provider: blueprintResult.provider,
    model: blueprintResult.model
  };
};

const markAutomationLeadAsHot = async ({ draftId, reenteredEmail }) => {
  const existingLead = await getAutomationRecordById(draftId);

  if (!existingLead) {
    return { status: 'draft_not_found' };
  }

  if (!existingLead.blueprint) {
    return { status: 'blueprint_not_ready' };
  }

  const normalizedOriginalEmail = String(existingLead.email || '').trim();
  const normalizedReenteredEmail = String(reenteredEmail || '').trim();
  const matchesOriginalEmail = normalizedOriginalEmail.toLowerCase() === normalizedReenteredEmail.toLowerCase();
  const storedReenteredEmail = matchesOriginalEmail ? '' : normalizedReenteredEmail;
  const confirmedEmailSource = matchesOriginalEmail ? 'original' : 'reentered';

  const appointmentRequestedAt = new Date().toISOString();
  const updatedLead = await updateAutomationRecord(draftId, {
    reenteredEmail: storedReenteredEmail,
    reconfirmedEmail: storedReenteredEmail,
    confirmedEmailSource,
    hotLead: true,
    leadTemperature: 'hot',
    appointmentRequestedAt,
    appointmentRequestStatus: 'requested',
    updatedAt: appointmentRequestedAt
  });

  if (!updatedLead) {
    return { status: 'draft_update_failed' };
  }

  const serializedLead = serializeSimulationLead(updatedLead);
  const confirmedContactEmail = serializedLead.confirmedContactEmail || normalizedOriginalEmail;

  console.log('Automation test drive lead marked as hot.', {
    id: draftId,
    email: serializedLead.email,
    reenteredEmail: serializedLead.reenteredEmail,
    confirmedContactEmail,
    businessName: serializedLead.businessName
  });

  await sendEmailIfConfigured({
    to: hotLeadNotificationEmail,
    subject: `Hot lead: ${serializedLead.businessName}`,
    html: buildSimulationHotLeadEmail(serializedLead),
    replyTo: confirmedContactEmail
  });

  return {
    status: 'ok',
    draft: serializedLead
  };
};

module.exports = {
  serializeSimulationLead,
  getLastCompletedStep,
  saveAutomationRecord,
  getAutomationRecordById,
  updateAutomationRecord,
  createAutomationDraft,
  updateAutomationDraftFields,
  completeAutomationExperience,
  markAutomationLeadAsHot
};