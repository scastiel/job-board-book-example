import { getToken, GetTokenParams } from 'next-auth/jwt'
import prisma from './prisma_server'

export const getCurrentUser = async (params: GetTokenParams) => {
  const token = await getToken(params)
  if (!token) return null

  const authId = `github:${token.sub}`
  return prisma.user.upsert({
    where: { authId },
    update: {},
    create: { authId, name: token.name || 'Anonymous' },
  })
}
