import { Hasher, Decrypter, Encrypter, HashComparer } from '@/data/protocols'
import faker from 'faker'

export class HasherSpy implements Hasher {
  result = faker.random.uuid()
  plaintext: string

  async hash (plaintext: string): Promise<string> {
    this.plaintext = plaintext
    return this.result
  }
}

export class DecrypterSpy implements Decrypter {
  result = faker.internet.password()
  ciphertext: string

  async decrypt (ciphertext: string): Promise<string> {
    this.ciphertext = ciphertext
    return this.result
  }
}

export class HashComparerSpy implements HashComparer {
  plaintext: string
  digest: string
  result = true

  async compare (plaintext: string, digest: string): Promise<boolean> {
    this.plaintext = plaintext
    this.digest = digest
    return this.result
  }
}

export class EncrypterSpy implements Encrypter {
  result = faker.random.uuid()
  plaintext: string

  async encrypt (plaintext: string): Promise<string> {
    this.plaintext = plaintext
    return this.result
  }
}
