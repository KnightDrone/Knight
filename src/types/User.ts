class User {
  private uid: string;
  private email: string;
  private displayName: string;
  private dob: Date; // date of birth

  constructor(uid: string, email: string, dob: Date, displayName?: string) {
    this.displayName = displayName || "";
    this.email = email;
    this.uid = uid;
    this.dob = dob;
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

  getBirthday() {
    return this.dob;
  }

  setEmail(newEmail: string) {
    this.email = newEmail;
  }

  setDisplayName(newName: string) {
    this.displayName = newName;
  }

  setBirthday(newDob: Date) {
    this.dob = newDob;
  }
}

const userConverter = {
  toFirestore: (user: User) => {
    return {
      uid: user.getId(),
      email: user.getEmail(),
      birthDate: user.getBirthday(),
      displayName: user.getDisplayName(),
    };
  },
  fromFirestore: (snapshot: any) => {
    const data = snapshot.data();
    const uid = snapshot.id;
    const dob = new Date(data.birthDate.seconds * 1000);
    const user = new User(uid, data.email, dob, data.displayName);

    return user;
  },
};

export { User, userConverter };
