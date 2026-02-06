const TYPES = {
  userModel: Symbol.for("userModel"),
  trainerModel: Symbol.for("trainerModel"),

  IUserRepository: Symbol.for("IUserRepository"),
  ITrainerRepository: Symbol.for("ITrainerRepository"),

  IAuthService: Symbol.for("IAuthService"),
  IAuthController: Symbol.for("IAuthController"),

  IUserService: Symbol.for("IUserService"),
  IUserController: Symbol.for("IUserController"),

  IAdminService: Symbol.for("IAdminService"),
  IAdminController: Symbol.for("IAdminController"),

  ITrainerService: Symbol.for("ITrainerService"),
  ITrainerController: Symbol.for("ITrainerController"),

  otpModel: Symbol.for("otpModel"),
  IOtpRepository: Symbol.for("IOtpRepository"),

  passwordResetModel: Symbol.for("passwordResetModel"),
  IPasswordResetRepository: Symbol.for("IPasswordResetRepository"),
};

export default TYPES;
