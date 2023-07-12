import { Test, TestingModule } from '@nestjs/testing';
import { EmailsController } from './emails.controller';
import { EmailsService } from './emails.service';

describe('EmailsController', () => {
  let emailsController: EmailsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [EmailsController],
      providers: [EmailsService],
    }).compile();

    emailsController = app.get<EmailsController>(EmailsController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(emailsController.getHello()).toBe('Hello World!');
    });
  });
});
