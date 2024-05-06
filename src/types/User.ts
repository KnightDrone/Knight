class User {
  private uid: string;
  private email: string;
  private displayName: string;
  private dob: Date; // date of birth
  private photoURL: string;
  private isOperator: boolean;
  private createdAt: Date;

  constructor(
    uid: string,
    email: string,
    isOperator: boolean,
    displayName: string,
    dob?: Date,
    photoURL?: string,
    createdAt?: Date
  ) {
    this.displayName = displayName;
    this.email = email;
    this.uid = uid;
    this.isOperator = isOperator;
    this.photoURL = photoURL || "../../../assets/images/defaultProfile.png";
    this.dob = dob || new Date("2000-01-01");
    this.createdAt = createdAt || new Date();
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

  getIsOperator() {
    return this.isOperator;
  }

  getPhotoURL() {
    return this.photoURL;
  }

  getCreatedAt() {
    return this.createdAt;
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

  setPhotoURL(newPhotoURL: string) {
    this.photoURL = newPhotoURL;
  }
}

const userConverter = {
  toFirestore: (user: User) => {
    return {
      uid: user.getId(),
      email: user.getEmail(),
      birthDate: user.getBirthday(),
      displayName: user.getDisplayName(),
      isOperator: user.getIsOperator(),
      photoURL: user.getPhotoURL(),
      createdAt: user.getCreatedAt(),
    };
  },
  fromFirestore: (snapshot: any) => {
    const data = snapshot.data();
    const uid = snapshot.id;
    const dob = new Date(data.birthDate.seconds * 1000);
    const createdAt = new Date(data.createdAt.seconds * 1000);
    const user = new User(
      uid,
      data.email,
      data.isOperator,
      data.displayName,
      dob,
      data.photoURL,
      createdAt
    );

    return user;
  },
};

export { User, userConverter };
