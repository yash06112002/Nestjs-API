import { Injectable, NotFoundException } from '@nestjs/common';

import { User } from './user.model';

@Injectable()
export class UsersService {
  private users: User[] = [];

  insertUser(userTitle: string) {
    const prodId = Math.random().toString();
    const isAllowed = true;
    const name = userTitle;
    const newUser = new User(prodId, name, isAllowed);
    this.users.push(newUser);

    return this.getUsers();
  }

  getUsers() {
    return [...this.users];
  }

  getSingleUser(userId: string) {
    const user = this.findUser(userId)[0];
    return { ...user };
  }

  updateUser(userId: string) {
    const [user, index] = this.findUser(userId);
    const updatedUser = { ...user };

    const currValue = updatedUser.isAllowed;
    updatedUser.isAllowed = !currValue;

    this.users[index] = updatedUser;

    return this.getUsers();
  }

  deleteUser(userId: string) {
    const index = this.findUser(userId)[1];
    this.users.splice(index, 1);

    return this.users;
  }

  private findUser(id: string): [User, number] {
    const userIndex = this.users.findIndex((prod) => prod.id === id);
    const user = this.users[userIndex];

    if (!user) {
      throw new NotFoundException('Could not find user.');
    }
    return [user, userIndex];
  }
}
