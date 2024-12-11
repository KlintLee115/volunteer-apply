import {
    BlobServiceClient,
    StorageSharedKeyCredential,
  } from '@azure/storage-blob'
  import { env } from '../env'
  
  const accountName = env.AZURE_STORAGE_ACCOUNT_NAME
  const accountKey = env.AZURE_STORAGE_ACCOUNT_KEY
  const containerName = 'resumes'
  
  // Create a BlobServiceClient
  const blobServiceClient = new BlobServiceClient(
    `https://${accountName}.blob.core.windows.net`,
    new StorageSharedKeyCredential(accountName, accountKey),
  )
  
  // Function to upload a file
  export async function uploadFile(file: File, email: string) {
    const containerClient = blobServiceClient.getContainerClient(containerName)
    const blobName = file.name
    const blockBlobClient = containerClient.getBlockBlobClient(blobName)
  
    await blockBlobClient.uploadData(file)
  
    const metadata = { email }
  
    await blockBlobClient.setMetadata(metadata)
  }