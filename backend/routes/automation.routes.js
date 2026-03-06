const express = require('express');

const {
  createAutomationDraftHandler,
  generateAutomationBlueprintHandler,
  getAutomationDraftHandler,
  requestAutomationAppointmentHandler,
  updateAutomationDraftHandler
} = require('../controllers/automation.controller');

const router = express.Router();

router.post('/draft', createAutomationDraftHandler);
router.get('/draft/:draftId', getAutomationDraftHandler);
router.patch('/draft/:draftId', updateAutomationDraftHandler);
router.post('/:draftId/hot-lead', requestAutomationAppointmentHandler);
router.post('/', generateAutomationBlueprintHandler);

module.exports = router;