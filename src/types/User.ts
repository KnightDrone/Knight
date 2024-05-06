class User {
  private uid: string;
  private email: string;
  private displayName: string;
  private dob: Date; // date of birth
  private password: string;

  constructor(
    uid: string,
    email: string,
    dob: Date,
    password: string,
    displayName: string
  ) {
    this.displayName = displayName || "";
    this.email = email;
    this.uid = uid;
    this.dob = dob;
    this.password = password;
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

  getPassword() {
    return this.password;
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

  setPassword(newPassword: string) {
    this.password = newPassword;
  }
}

const userConverter = {
  toFirestore: (user: User) => {
    return {
      uid: user.getId(),
      email: user.getEmail(),
      birthDate: user.getBirthday(),
      displayName: user.getDisplayName(),
      password: user.getPassword(),
    };
  },
  fromFirestore: (snapshot: any) => {
    const data = snapshot.data();
    const uid = snapshot.id;
    const dob = new Date(data.birthDate.seconds * 1000);
    const user = new User(
      uid,
      data.email,
      dob,
      data.password,
      data.displayName
    );

    return user;
  },
};

export { User, userConverter };
