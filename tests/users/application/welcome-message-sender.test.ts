import { WelcomeMessageSender } from "../../../src/users/application/welcome-message-sender";

describe("WelcomeMessageSender", () => {
  const userId = "123";
  const userEmail = "test@example.com";
  const userRepositoryMock = {
    getById: jest.fn().mockResolvedValue({
      id: userId,
      email: userEmail,
    }),
  };
  const emailSenderMock = {
    sendMessage: jest.fn(),
  };
  const loggerMock = {
    info: jest.fn(),
    error: jest.fn(),
  };
  const welcomeMessageSender = new WelcomeMessageSender(
    userRepositoryMock,
    emailSenderMock,
    loggerMock
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should send a welcome message to the user", async () => {
    await welcomeMessageSender.sendToUser(userId);

    expect(emailSenderMock.sendMessage).toHaveBeenCalledWith(
      userEmail,
      "Welcome dev!"
    );
    expect(loggerMock.info).toHaveBeenCalledWith(
      `[WelcomeMessageSender] - Sending welcome email to user: ${userId}`
    );
    expect(loggerMock.info).toHaveBeenCalledWith(
      "[WelcomeMessageSender] - Successfully sent the welcome message to the user"
    );
  });

  it("should throw an error if the user is not found", async () => {
    userRepositoryMock.getById.mockResolvedValueOnce(null);

    await expect(welcomeMessageSender.sendToUser(userId)).rejects.toThrow(
      `User not found: ${userId}`
    );
    expect(loggerMock.error).toHaveBeenCalledWith(`User not found: ${userId}`);
  });
});
