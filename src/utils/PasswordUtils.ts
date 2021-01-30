import * as bcrypt from 'bcrypt';

export class PasswordUtils {
  public async generateHash(password: string): Promise<string> {
    try {
      const hash = await bcrypt.hash(password, 12);
      return hash;
    } catch (error) {
      return error;
    }
  }

  public async compareHash(passwordCandidate: string, hash: string): Promise<boolean> {
    try {
      const match = await bcrypt.compare(passwordCandidate, hash);
      return match;
    } catch (error) {
      return error;
    }
  }
}
