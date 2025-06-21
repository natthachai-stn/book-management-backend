// import { InjectModel } from "@nestjs/mongoose";
// import { User } from "../drizzle/schema/user.schema";
// import { Model } from "mongoose";
// import { Injectable } from "@nestjs/common";
// import { BaseMongoRepository } from "../base/base-mongo.repository";

// @Injectable()
// export class UserRepository extends BaseMongoRepository<User> {
//   constructor(
//     @InjectModel(User.name) readonly userModel: Model<User>,
//   ) {
//     super(userModel);
//   }

// }