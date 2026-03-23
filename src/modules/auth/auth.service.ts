import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OAuth2Client } from 'google-auth-library';
import { User } from '@core/entities/user.entity';

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {
    this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  async validateGoogleToken(token: string) {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new UnauthorizedException('Invalid Google token payload');
      }

      const { sub: googleId, email, name, picture: avatarUrl } = payload;

      // Find or create user
      let user = await this.userRepository.findOne({ where: [{ googleId }, { email }] });

      if (!user) {
        user = this.userRepository.create({
          googleId,
          email,
          name: name || email,
          avatarUrl,
        });
        await this.userRepository.save(user);
      } else {
        // Update googleId and avatar if missing
        if (!user.googleId || !user.avatarUrl) {
          user.googleId = googleId;
          user.avatarUrl = avatarUrl;
          await this.userRepository.save(user);
        }
      }

      return this.generateJwt(user);
    } catch (error) {
      console.error('Google verification error:', error);
      throw new UnauthorizedException('Google authentication failed');
    }
  }

  private generateJwt(user: User) {
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
      },
    };
  }
}
