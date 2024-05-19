class User {
  private uid: string;
  private email: string;
  private displayName: string;
  private dob: Date; // date of birth
  private isOperator: boolean;
  private createdAt: Date;
  private phoneNumber?: string;
  private photoID?: string;

  constructor(
    uid: string,
    email: string,
    isOperator: boolean,
    displayName: string,
    phoneNumber?: string,
    photoID?: string,
    dob?: Date,
    createdAt?: Date
  ) {
    this.displayName = displayName;
    this.email = email;
    this.uid = uid;
    this.isOperator = isOperator;
    this.phoneNumber = phoneNumber;
    this.photoID = photoID;
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

  getCreatedAt() {
    return this.createdAt;
  }

  getPhoneNumber() {
    return this.phoneNumber;
  }

  getPhotoID() {
    return this.photoID;
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

  setPhoneNumber(newPhoneNumber: string) {
    this.phoneNumber = newPhoneNumber;
  }

  setPhotoID(newPhotoID: string) {
    this.photoID = newPhotoID;
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
      createdAt: user.getCreatedAt(),
      phoneNumber: user.getPhoneNumber(),
      photoID: user.getPhotoID(),
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
      data.phoneNumber,
      data.photoID,
      dob,
      createdAt
    );

    return user;
  },
};

export { User, userConverter };
