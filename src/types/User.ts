export class User {
  private uid: string;
  private email: string;
  private displayName: string;

  constructor(uid: string, email: string, displayName?: string) {
    this.displayName = displayName || "";
    this.email = email;
    this.uid = uid;
  }

  getId() {
    return this.uid;
  }

  getEmail() {
    return this.email;
  }

  getDisplayName() {
    return this.displayName;
  }

  setEmail(newEmail: string) {
    this.email = newEmail;
  }

  setDisplayName(newName: string) {
    this.displayName = newName;
  }
}

const UserConverter = {
  toFirestore: (user: User) => {
    return {
      uid: user.getId(),
      email: user.getEmail(),
      displayName: user.getDisplayName(),
    };
  },
  fromFirestore: (snapshot: any) => {
    const data = snapshot.data();
    const uid = snapshot.id;
    const user = new User(uid, data.email, data.displayName);

    return user;
  },
};
