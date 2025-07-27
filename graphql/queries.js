// GraphQL query definitions and field mappings

const FIELD_TO_QUERY_MAP = {
  tumor_status: 'samplesByTumorStatus',
  anatomic_site: 'samplesByAnatomicSite',
  tumor_classification: 'samplesByTumorClassification',
  tissue_type: 'samplesByTissueType',
  primary_diagnosis: 'samplesByPrimaryDiagnosis',
};

const SAMPLE_COUNT_QUERIES = {
  samplesByTumorStatus: `
    query SamplesByTumorStatus {
      samplesByTumorStatus {
        field
        count
      }
    }
  `,
  samplesByAnatomicSite: `
    query SamplesByAnatomicSite {
      samplesByAnatomicSite{
        field
        count
      }
    }
  `,
  samplesByTumorClassification: `
    query SamplesByTumorClassification {
      samplesByTumorClassification {
        field
        count
      }
    }
  `,
  samplesByTissueType: `
    query SamplesByTissueType {
      samplesByTissueType {
        field
        count
      }
    }
  `,
  samplesByPrimaryDiagnosis: `
    query SamplesByPrimaryDiagnosis {
      samplesByPrimaryDiagnosis {
        field
        count
      }
    }
  `,
};

// Additional query for getting sample details
const SAMPLE_DETAILS_QUERY = `
  query SampleDetails($filters: SampleFilters, $limit: Int, $offset: Int) {
    samples(filters: $filters, limit: $limit, offset: $offset) {
      id
      submitterSampleId
      tumorStatus
      anatomicSite
      tumorClassification
      tissueType
      primaryDiagnosis
      createdAt
      updatedAt
    }
  }
`;

// Health check query
const HEALTH_CHECK_QUERY = `
  query HealthCheck {
    __schema {
      queryType {
        name
      }
    }
  }
`;

module.exports = {
  FIELD_TO_QUERY_MAP,
  SAMPLE_COUNT_QUERIES,
  SAMPLE_DETAILS_QUERY,
  HEALTH_CHECK_QUERY,
};
