// import { ConflictException } from '@nestjs/common';
// import { PrismaClient } from '@prisma/client';

// export class PrismaAggregate {
//   private prisma: PrismaClient;

//   constructor() {
//     this.prisma = new PrismaClient();
//   }

//   async checkDataExists(
//     table: string,
//     condition: Record<string, any>,
//   ): Promise<any> {
//     try {
//       const existingData = await this.prisma[table].findMany({
//         where: condition,
//       });

//       if (existingData.length > 0) {
//         throw new ConflictException('already exist!');
//       }
//     } catch (error) {
//       throw error;
//     } finally {
//       await this.prisma.$disconnect();
//     }
//   }
// }
