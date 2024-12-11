import { AzureKeyCredential, SearchClient } from '@azure/search-documents'
import { env } from '../env'

const searchServiceName = 'trying-azsearch'
const searchApiKey = env.AZURE_RESUME_SEARCH_API_KEY
const indexName = 'azureblob-index'

type DocumentType = {
  email: string
  content: string
  metadata_language: string
}

// Create a SearchClient
const searchClient = new SearchClient(
  `https://${searchServiceName}.search.windows.net`,
  indexName,
  new AzureKeyCredential(searchApiKey),
)

// Function to search for resumes in the Azure Cognitive Search index
export async function searchResumes(searchTerm: string) {
  const searchResults = await searchClient.search(searchTerm)
  const blobs = []

  for await (const result of searchResults.results) {
    const document = result.document as DocumentType

    blobs.push(document)
  }

  return blobs
}