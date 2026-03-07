const { serviceCatalogCollectionName } = require('../config/env');
const { getDatabase } = require('../config/database');
const { approvedServiceCatalog } = require('../data/services.seed');
const { normalizeText } = require('../utils/text');

const fallbackServiceCatalog = approvedServiceCatalog.map((service, index) => ({
  ...service,
  id: `memory-service-${index + 1}`,
  displayOrder: index + 1
}));

let catalogInitializationPromise = null;

const tokenize = (value) =>
  normalizeText(value)
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);

const buildSeedDocuments = () => {
  const timestamp = new Date().toISOString();

  return approvedServiceCatalog.map((service, index) => ({
    ...service,
    displayOrder: index + 1,
    createdAt: timestamp,
    updatedAt: timestamp
  }));
};

const mapStoredService = (service, index = 0) => ({
  id: service._id?.toString?.() || service.id || service.slug || `service-${index + 1}`,
  slug: service.slug,
  name: service.name,
  category: service.category,
  summary: service.summary,
  capabilities: Array.isArray(service.capabilities) ? service.capabilities : [],
  keywords: Array.isArray(service.keywords) ? service.keywords : [],
  recommendedNextStep: service.recommendedNextStep || '',
  displayOrder: service.displayOrder || index + 1
});

const ensureServiceCatalog = async () => {
  if (!catalogInitializationPromise) {
    catalogInitializationPromise = (async () => {
      const database = await getDatabase();

      if (!database) {
        return { storage: 'memory', seeded: false };
      }

      const collection = database.collection(serviceCatalogCollectionName);
      const existingCount = await collection.countDocuments();

      if (existingCount === 0) {
        await collection.insertMany(buildSeedDocuments());
        console.log(`Approved Expult service catalog seeded to MongoDB collection ${serviceCatalogCollectionName}.`);
        return { storage: 'mongodb', seeded: true };
      }

      return { storage: 'mongodb', seeded: false };
    })().catch((error) => {
      console.error('Service catalog initialization failed. Falling back to in-memory catalog.', error);
      return { storage: 'memory', seeded: false, error: error.message };
    });
  }

  return catalogInitializationPromise;
};

const getServiceCatalog = async () => {
  await ensureServiceCatalog();
  const database = await getDatabase();

  if (!database) {
    return fallbackServiceCatalog.map((service, index) => mapStoredService(service, index));
  }

  const services = await database.collection(serviceCatalogCollectionName).find({}).sort({ displayOrder: 1 }).toArray();

  if (!services.length) {
    return fallbackServiceCatalog.map((service, index) => mapStoredService(service, index));
  }

  return services.map((service, index) => mapStoredService(service, index));
};

const scoreServiceMatch = (message, service) => {
  const normalizedMessage = normalizeText(message).toLowerCase();
  const messageTokens = tokenize(message);
  const searchablePhrases = [service.name, service.category, service.summary, ...(service.capabilities || []), ...(service.keywords || [])]
    .map((value) => normalizeText(value).toLowerCase())
    .filter(Boolean);
  const searchableTokens = tokenize(searchablePhrases.join(' '));
  let score = 0;

  searchablePhrases.forEach((phrase) => {
    if (phrase && normalizedMessage.includes(phrase)) {
      score += phrase === normalizeText(service.name).toLowerCase() ? 12 : 4;
    }
  });

  messageTokens.forEach((token) => {
    if (searchableTokens.includes(token)) {
      score += 1;
    }
  });

  if (normalizedMessage.includes('chatbot') || normalizedMessage.includes('chat assistant')) {
    if (service.slug === 'ai-business-assistants') {
      score += 8;
    }
    if (service.slug === 'revenue-automation-systems') {
      score += 2;
    }
  }

  if (normalizedMessage.includes(' ai ') || normalizedMessage.startsWith('ai ') || normalizedMessage.includes('ai chatbot')) {
    if (service.slug === 'ai-business-assistants') {
      score += 5;
    }
  }

  if (normalizedMessage.includes('support') || normalizedMessage.includes('customer questions')) {
    if (service.slug === 'ai-business-assistants') {
      score += 4;
    }
  }

  if (normalizedMessage.includes('website') || normalizedMessage.includes('landing page')) {
    if (service.slug === 'intelligent-website-systems') {
      score += 3;
    }
  }

  return score;
};

const isGenericCatalogQuestion = (message) => {
  const normalizedMessage = normalizeText(message).toLowerCase();

  return ['what do you offer', 'services', 'what can you build', 'what do you do', 'offerings'].some((phrase) =>
    normalizedMessage.includes(phrase)
  );
};

const findMatchingServices = (message, services) => {
  const catalog = Array.isArray(services) && services.length ? services : fallbackServiceCatalog;

  if (isGenericCatalogQuestion(message)) {
    return catalog.slice(0, 4);
  }

  return catalog
    .map((service) => ({ service, score: scoreServiceMatch(message, service) }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, 3)
    .map((entry) => entry.service);
};

const buildServicesKnowledgeSummary = (services) =>
  services
    .map(
      (service) =>
        `${service.name} (${service.category}) — ${service.summary} Key capabilities: ${service.capabilities.join(', ')}. Next step: ${service.recommendedNextStep}`
    )
    .join('\n');

module.exports = {
  ensureServiceCatalog,
  getServiceCatalog,
  findMatchingServices,
  buildServicesKnowledgeSummary
};