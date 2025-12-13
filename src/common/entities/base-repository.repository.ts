// import {
//   CreateDateColumn,
//   UpdateDateColumn,
//   DeleteDateColumn,
//   VersionColumn,
//   Repository,
// } from 'typeorm';

// export abstract class BaseRepository {
//   private repo: Repository<T>;

//   constructor(connection) {
//     this.repo = connection.getRepository(Feedback);
//   }

//   query = async (sql: string, sqlParams) => {
//     return await this.repo.query(sql, sqlParams);
//   };
// }
