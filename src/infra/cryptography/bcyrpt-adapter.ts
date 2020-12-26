import { Hasher } from '@/data/protocols/cryptography/hasher'
import bcrypt from 'bcrypt'
import { HashComparer } from '@/data/protocols/cryptography/hash-comparer'

export class BcryptAdapter implements Hasher, HashComparer {
  constructor (
    private readonly salt: number
  ) {}

  async hash (plaintext: string): Promise<string> {
    const digest = bcrypt.hash(plaintext, this.salt)
    return digest
  }

  async compare (plaintext: string, digest: string): Promise<boolean> {
    const isValid = bcrypt.compare(plaintext, digest)
    return isValid
  }
}
