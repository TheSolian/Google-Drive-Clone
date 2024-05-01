'use server'

import { auth } from '@/auth'
import { db } from '@/lib/db'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl as generateSignedUrl } from '@aws-sdk/s3-request-presigner'
import { File } from '@prisma/client'
import crypto from 'crypto'

const s3 = new S3Client({
  region: process.env.AWS_BUCKET_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

const allowedFileTypes = ['image/jpeg', 'image/png', 'video/mp4']
const maxFileSize = 1048576 * 10 // 10MB

function generateKey(fileName: string, userId: string) {
  const name = fileName.split('.')[0]
  const extension = fileName.split('.')[1]

  const key = `${name.toLowerCase()}-${userId}-${crypto
    .randomBytes(8)
    .toString('hex')}.${extension}`

  return key
}

export async function getSignedUrl(
  fileName: string,
  fileType: string,
  fileSize: number,
  checksum: string
) {
  const session = await auth()

  if (!session) {
    return { error: 'Not authenticated' }
  }

  if (!allowedFileTypes.includes(fileType)) {
    return { error: 'File type not allowed' }
  }

  if (fileSize > maxFileSize) {
    return { error: 'File is too large' }
  }

  const key = generateKey(fileName, session.user.id)

  const putObjectCommand = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: key,
    ContentType: fileType,
    ContentLength: fileSize,
    ChecksumSHA256: checksum,
    Metadata: {
      userId: session.user.id,
    },
  })

  const signedUrl = await generateSignedUrl(s3, putObjectCommand, {
    expiresIn: 120,
  })

  return { success: { url: signedUrl, key } }
}

export async function saveFileToDatabase(
  fileName: string,
  fileType: string,
  fileSize: number,
  folderId: string | null,
  userId: string,
  key: string
) {
  const res = await db.file.create({
    data: {
      name: fileName,
      fileType: fileName.split('.')[1],
      size: fileSize,
      mimeType: fileType,
      awsUrl: `https://drive-clone.s3.eu-central-1.amazonaws.com/${key}`,
      parentId: folderId,
      ownerId: userId,
    },
  })

  return res
}

export async function getFiles(folderId: string | null, userId: string) {
  return await db.file.findMany({
    where: {
      AND: {
        parentId: folderId,
        ownerId: userId,
      },
    },
  })
}

export async function getPathFolders(path: string[]) {
  const result: File[] = []

  if (path.length > 1) {
    const res = await db.file.findFirst({
      where: {
        id: path[1],
      },
    })
    if (res) {
      result.push(res)
    }
  }

  return result
}

export async function getPath(currentId: string) {
  const path: File[] = []

  async function fillPath(path: File[], currentId: string) {
    const current = await db.file.findFirst({
      where: {
        id: currentId,
      },
    })

    if (current) {
      path.push(current)

      if (current.parentId !== null) {
        fillPath(path, current.parentId)
      }
    }
  }

  fillPath(path, currentId)

  return { success: { path: path } }
}

export async function createFolder(
  name: string,
  parentId: string | null,
  userId: string
) {
  const existingFolder = await db.file.findFirst({
    where: {
      AND: {
        name,
        parentId,
      },
    },
  })

  if (existingFolder) return { error: 'Folder already exists' }

  const newFolder = await db.file.create({
    data: {
      name,
      parentId,
      ownerId: userId,
    },
  })

  return { success: { newFolder } }
}

export async function deleteFolder(folderId: string) {
  await db.file.deleteMany({
    where: {
      id: folderId,
    },
  })

  return { success: true }
}

export async function renameFolder(folderId: string, name: string) {
  const res = await db.file.update({
    where: {
      id: folderId,
    },
    data: {
      name,
    },
  })

  return { success: { folder: res } }
}
