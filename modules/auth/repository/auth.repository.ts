import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthEntity } from './auth.entity';
import { InsertResult, Repository, UpdateResult } from 'typeorm';
import { registerDto } from '../dto/index.dto';

Injectable();
export class AuthRepository {
  public constructor(
    @InjectRepository(AuthEntity)
    private readonly repository: Repository<AuthEntity>,
  ) {}

  public async registerUser(userData: registerDto): Promise<InsertResult> {
    const insertUserInfo = await this.repository.insert(userData);
    return insertUserInfo;
  }

  public async getSingleUserInfo(
    email?: string,
    id?: number,
  ): Promise<AuthEntity> {
    const userInfo = await this.repository.findOne({
      where: [{ email }, { id }],
    });
    return userInfo;
  }

  public async updateUser(userData: AuthEntity): Promise<UpdateResult> {
    console.log(userData.id);

    const updateResult = await this.repository.update(
      { id: userData.id },
      { ...userData },
    );
    return updateResult;
  }

  public async updateUserByEmail(userData: AuthEntity): Promise<UpdateResult> {
    console.log(userData.email); // Assuming email is the unique identifier

    const updateResult = await this.repository.update(
      { email: userData.email }, // Update based on the email
      { ...userData },
    );
    return updateResult;
  }

  public async deleteFaq(id: number): Promise<Boolean> {
    const deleteResult: any = await this.repository.delete({ id: id });
    return deleteResult.affected !== undefined && deleteResult.affected > 0;
  }
}
