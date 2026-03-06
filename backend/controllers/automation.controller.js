const { normalizeText, isValidEmail } = require('../utils/text');
const {
  createAutomationDraft,
  completeAutomationExperience,
  getAutomationRecordById,
  markAutomationLeadAsHot,
  serializeSimulationLead,
  updateAutomationDraftFields
} = require('../services/automation.service');

const normalizePriorityInput = (value) => {
  const priorities = Array.isArray(value) ? value : typeof value === 'string' ? [value] : [];

  return Array.from(
    new Set(
      priorities
        .map((priority) => normalizeText(priority))
        .filter(Boolean)
    )
  );
};

const createAutomationDraftHandler = async (req, res, next) => {
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

    const result = await createAutomationDraft({ name, email, businessName });

    return res.status(201).json({
      status: 'ok',
      message: 'Your details have been saved.',
      draft: result.draft
    });
  } catch (error) {
    return next(error);
  }
};

const getAutomationDraftHandler = async (req, res, next) => {
  try {
    const draft = await getAutomationRecordById(req.params.draftId);

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
};

const updateAutomationDraftHandler = async (req, res, next) => {
  try {
    const existingDraft = await getAutomationRecordById(req.params.draftId);

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
    const prioritiesProvided = Object.prototype.hasOwnProperty.call(req.body, 'priorities');

    if (!nameProvided && !emailProvided && !businessNameProvided && !businessTypeProvided && !priorityProvided && !prioritiesProvided) {
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

    if (prioritiesProvided) {
      const priorities = normalizePriorityInput(req.body.priorities);

      if (!priorities.length) {
        return res.status(400).json({
          status: 'error',
          message: 'Select at least one priority before saving your progress.'
        });
      }

      updates.priorities = priorities;
      updates.priority = priorities.join(', ');
    } else if (priorityProvided) {
      const priority = normalizeText(req.body.priority);

      if (!priority) {
        return res.status(400).json({
          status: 'error',
          message: 'Priority cannot be empty.'
        });
      }

      updates.priorities = [priority];
      updates.priority = priority;
    }

    const updatedDraft = await updateAutomationDraftFields(req.params.draftId, updates);

    return res.json({
      status: 'ok',
      message: 'Your saved automation draft has been updated.',
      draft: updatedDraft
    });
  } catch (error) {
    return next(error);
  }
};

const generateAutomationBlueprintHandler = async (req, res, next) => {
  try {
    const draftId = normalizeText(req.body.draftId);
    const name = normalizeText(req.body.name);
    const email = normalizeText(req.body.email);
    const businessName = normalizeText(req.body.businessName);
    const businessType = normalizeText(req.body.businessType);
    const priorities = normalizePriorityInput(req.body.priorities);
    const priority = priorities.join(', ') || normalizeText(req.body.priority);

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

    const result = await completeAutomationExperience({
      draftId,
      name,
      email,
      businessName,
      businessType,
      priority,
      priorities
    });

    if (result.status === 'draft_not_found') {
      return res.status(404).json({
        status: 'error',
        message: 'The saved automation draft could not be found. Please restart the experience.'
      });
    }

    if (result.status === 'draft_update_failed') {
      return res.status(404).json({
        status: 'error',
        message: 'The saved automation draft could not be updated. Please restart the experience.'
      });
    }

    return res.status(201).json({
      status: 'ok',
      message: 'Your automation blueprint is ready.',
      draftId: result.draftId,
      blueprint: result.blueprint,
      provider: result.provider,
      model: result.model
    });
  } catch (error) {
    return next(error);
  }
};

const requestAutomationAppointmentHandler = async (req, res, next) => {
  try {
    const reenteredEmail = normalizeText(req.body.email);

    if (!reenteredEmail || !isValidEmail(reenteredEmail)) {
      return res.status(400).json({
        status: 'error',
        message: 'Please re-enter a valid email address to request your appointment.'
      });
    }

    const result = await markAutomationLeadAsHot({
      draftId: req.params.draftId,
      reenteredEmail
    });

    if (result.status === 'draft_not_found') {
      return res.status(404).json({
        status: 'error',
        message: 'The automation record could not be found. Please reopen your blueprint and try again.'
      });
    }

    if (result.status === 'blueprint_not_ready') {
      return res.status(400).json({
        status: 'error',
        message: 'Complete the automation blueprint experience before requesting an appointment.'
      });
    }

    if (result.status === 'draft_update_failed') {
      return res.status(404).json({
        status: 'error',
        message: 'We could not update your automation record right now. Please try again.'
      });
    }

    return res.json({
      status: 'ok',
      message: 'Appointment request has been triggered and one of our support team members will reach back shortly.',
      draft: result.draft
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createAutomationDraftHandler,
  getAutomationDraftHandler,
  updateAutomationDraftHandler,
  generateAutomationBlueprintHandler,
  requestAutomationAppointmentHandler
};