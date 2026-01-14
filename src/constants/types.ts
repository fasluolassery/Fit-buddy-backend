const TYPES = {
  userModel: Symbol.for("userModel"),
  IUserRepository: Symbol.for("IUserRepository"),
  IAuthService: Symbol.for("IAuthService"),
  IAuthController: Symbol.for("IAuthController"),
  otpModel: Symbol.for("otpModel"),
  IOtpRepository: Symbol.for("IOtpRepository"),
  IUserService: Symbol.for("IUserService"),
  IUserController: Symbol.for("IUserController"),
  passwordResetModel: Symbol.for("passwordResetModel"),
  IPasswordResetRepository: Symbol.for("IPasswordResetRepository"),
};

export default TYPES;
