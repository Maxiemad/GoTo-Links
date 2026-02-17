import { v2 as cloudinary } from 'cloudinary'

// Initialize Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

export interface SignatureParams {
  timestamp: number
  signature: string
  cloudName: string
  apiKey: string
  folder: string
  resourceType: string
}

const ALLOWED_FOLDERS = ['users/', 'profiles/', 'uploads/']

export function generateSignature(
  folder: string = 'uploads',
  resourceType: 'image' | 'video' = 'image'
): SignatureParams {
  // Validate folder
  const isAllowed = ALLOWED_FOLDERS.some(allowed => folder.startsWith(allowed) || folder === allowed.slice(0, -1))
  if (!isAllowed) {
    throw new Error('Invalid folder path')
  }

  const timestamp = Math.round(Date.now() / 1000)
  
  const params = {
    timestamp,
    folder,
  }

  const signature = cloudinary.utils.api_sign_request(
    params,
    process.env.CLOUDINARY_API_SECRET!
  )

  return {
    timestamp,
    signature,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
    apiKey: process.env.CLOUDINARY_API_KEY!,
    folder,
    resourceType,
  }
}

export async function deleteAsset(publicId: string): Promise<boolean> {
  try {
    await cloudinary.uploader.destroy(publicId, { invalidate: true })
    return true
  } catch (error) {
    console.error('Error deleting Cloudinary asset:', error)
    return false
  }
}

export function getOptimizedUrl(
  publicId: string,
  options: {
    width?: number
    height?: number
    crop?: string
    quality?: string
    format?: string
  } = {}
): string {
  const transformations = []
  
  if (options.width) transformations.push(`w_${options.width}`)
  if (options.height) transformations.push(`h_${options.height}`)
  if (options.crop) transformations.push(`c_${options.crop}`)
  transformations.push(options.quality || 'q_auto')
  transformations.push(options.format || 'f_auto')
  
  const transformString = transformations.join(',')
  
  return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${transformString}/${publicId}`
}

export default cloudinary
