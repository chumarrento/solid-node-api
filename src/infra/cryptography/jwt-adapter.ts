import jwt from 'jsonwebtoken'
import { Decrypter } from '@/data/protocols/cryptography/decrypter'
import { Encrypter } from '@/data/protocols/cryptography/encrypter'

export class JwtAdapter implements Encrypter, Decrypter {
  constructor (
    private readonly secret: string
  ) {}

  async encrypt (plaintext: string): Promise<string> {
    const ciphertext = await jwt.sign({ id: plaintext }, this.secret)
    return ciphertext
  }

  async decrypt (ciphertext: string): Promise<string> {
    const plaintext: any = await jwt.verify(ciphertext, this.secret)
    return plaintext
  }
}
