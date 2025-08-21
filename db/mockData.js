/**
 * Mock Data Seed
 * --------------
 * Provides small in-memory collections that mimic the shape of records the
 * real graph/database layer will return. Repositories import these arrays to
 * simulate filtering, pagination and aggregation logic during early API
 * development & contract testing. Swap out with real persistence without
 * changing higher application layers.
 */
// NOTE: Replace with real Memgraph Cypher queries in production

const organizations = [
  { name: 'ExampleOrg', metadata: { description: 'Example Organization' } },
  { name: 'Treehouse', metadata: { description: 'UCSC Treehouse' } },
];

const namespaces = [
  { organization: 'ExampleOrg', namespace: 'StudyA', metadata: { study_id: 'STUDY_A', study_name: 'Study Alpha' } },
  { organization: 'Treehouse', namespace: 'StudyB', metadata: { study_id: 'STUDY_B', study_name: 'Study Beta' } },
];

const subjects = [
  { organization: 'ExampleOrg', namespace: 'StudyA', name: 'SUBJ001', sex: 'Male', race: 'White', ethnicity: 'Not Hispanic or Latino', vital_status: 'Alive', age_at_vital_status: 120, depositions: ['DBGAP:PHS001'], metadata: { unharmonized: { custom_field: 'X1' }, associated_diagnoses: 'Leukemia' } },
  { organization: 'ExampleOrg', namespace: 'StudyA', name: 'SUBJ002', sex: 'Female', race: 'Asian', ethnicity: 'Not Reported', vital_status: 'Deceased', age_at_vital_status: 90, depositions: [], metadata: { unharmonized: { custom_field: 'X2' }, associated_diagnoses: 'Lymphoma' } },
  { organization: 'Treehouse', namespace: 'StudyB', name: 'SUBJ003', sex: 'Male', race: 'Black', ethnicity: 'Not Reported', vital_status: 'Alive', age_at_vital_status: 60, depositions: ['DBGAP:PHS003'], metadata: { unharmonized: { custom_field: 'X3' }, associated_diagnoses: 'Neuroblastoma' } },
];

const samples = [
  { organization: 'ExampleOrg', namespace: 'StudyA', name: 'SAMP001', disease_phase: 'Initial Diagnosis', anatomical_sites: ['Liver'], library_selection_method: 'Poly-A Enriched Genomic Library', library_strategy: 'RNA-Seq', library_source_material: 'Bulk Tissue', preservation_method: 'FFPE', tumor_grade: 'Grade I', specimen_molecular_analyte_type: 'RNA', tissue_type: 'Tumor', tumor_classification: 'Primary', age_at_diagnosis: 120, age_at_collection: 121, tumor_tissue_morphology: 'TypeA', depositions: [], diagnosis: 'Leukemia', metadata: { unharmonized: { sample_extra: 'A' } } },
  { organization: 'ExampleOrg', namespace: 'StudyA', name: 'SAMP002', disease_phase: 'Relapse', anatomical_sites: ['Bone'], library_selection_method: 'Poly-A Enriched Genomic Library', library_strategy: 'RNA-Seq', library_source_material: 'Bulk Cells', preservation_method: 'Frozen', tumor_grade: 'Grade II', specimen_molecular_analyte_type: 'RNA', tissue_type: 'Tumor', tumor_classification: 'Metastatic', age_at_diagnosis: 100, age_at_collection: 105, tumor_tissue_morphology: 'TypeB', depositions: [], diagnosis: 'Lymphoma', metadata: { unharmonized: { sample_extra: 'B' } } },
  { organization: 'Treehouse', namespace: 'StudyB', name: 'SAMP003', disease_phase: 'Initial Diagnosis', anatomical_sites: ['Brain'], library_selection_method: 'Poly-A Enriched Genomic Library', library_strategy: 'RNA-Seq', library_source_material: 'Bulk Tissue', preservation_method: 'Frozen', tumor_grade: 'Grade III', specimen_molecular_analyte_type: 'RNA', tissue_type: 'Normal', tumor_classification: 'Primary', age_at_diagnosis: 60, age_at_collection: 61, tumor_tissue_morphology: 'TypeC', depositions: [], diagnosis: 'Neuroblastoma', metadata: { unharmonized: { sample_extra: 'C' } } },
];

const files = [
  { organization: 'ExampleOrg', namespace: 'StudyA', name: 'FILE001', type: 'FASTQ', size: 123456, description: 'RNA-Seq reads', checksums: { md5: 'abc123' }, depositions: [], metadata: { unharmonized: { file_tag: 'raw' } } },
  { organization: 'ExampleOrg', namespace: 'StudyA', name: 'FILE002', type: 'BAM', size: 654321, description: 'Aligned reads', checksums: { md5: 'def456' }, depositions: [], metadata: { unharmonized: { file_tag: 'aligned' } } },
  { organization: 'Treehouse', namespace: 'StudyB', name: 'FILE003', type: 'VCF', size: 111111, description: 'Variants', checksums: { md5: 'ghi789' }, depositions: [], metadata: { unharmonized: { file_tag: 'variants' } } },
];

module.exports = {
  organizations,
  namespaces,
  subjects,
  samples,
  files,
};
