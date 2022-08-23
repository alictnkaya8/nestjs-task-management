import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TaskStatus } from './task-status.enum';
import { TasksRepository } from './tasks.repository';
import { TasksService } from './tasks.service';

const mockTasksRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
  createTask: jest.fn(),
  delete: jest.fn(),
  save: jest.fn(),
});

const mockUser = {
  username: "testUser",
  id: "someId",
  password: 'somePassword',
  tasks: [],
}

const mockTask = {
  title: 'Test title',
  description: 'Test desc',
  id: 'someId',
  status: TaskStatus.OPEN,
};

describe('TasksService', () => {
  let tasksService: TasksService;
  let tasksRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TasksRepository, useFactory: mockTasksRepository },
      ],
    }).compile();

    tasksService = module.get(TasksService);
    tasksRepository = module.get(TasksRepository);
  });

  describe('getTasks', () => {
    it('calls TasksRepository.getTasks and returns the result',async () => {
      tasksRepository.getTasks.mockResolvedValue('someValue');
      const result = await tasksService.getTasks(null, mockUser);
      expect(result).toEqual('someValue');
    });
  });

  describe('getTaskById', () => {
    it('calls TasksRepository.findOne and returns the result', async () => {
      tasksRepository.findOne.mockResolvedValue(mockTask);
      const result = await tasksService.getTaskById(mockTask.id, mockUser);
      expect(result).toEqual(mockTask);
    });

    it('calls TasksRepository.findOne and handles an error', async () => {
      tasksRepository.findOne.mockResolvedValue(null);
      expect(tasksService.getTaskById(mockTask.id, mockUser)).rejects.toThrow(NotFoundException);
    });
  });

  describe('createTask', () => {
    it('calls TasksRepository.createTask and create new task', async () => {
      const mockTaskDto = {
        title: 'Test title',
        description: 'Test desc',
      };
      tasksRepository.createTask.mockResolvedValue(mockTaskDto);
      const result = await tasksService.createTask(mockTaskDto, mockUser);
      expect(result).toEqual(mockTaskDto);
    });
  });

  describe('deleteTask', () => {
    it('calls TasksRepository.delete and delete the task', async () => {
      tasksRepository.delete.mockResolvedValue(mockTask.id);
      const result = await tasksService.deleteTask(mockTask.id, mockUser)
      expect(result).toEqual(true);
    });
  });
  describe('updateTaskStatus', () => {
    it("calls TasksRepository.save and update the task's status", async () => {
      tasksRepository.findOne.mockResolvedValue(mockTask.id);
      await tasksService.getTaskById(mockTask.id, mockUser);
      mockTask.status = TaskStatus.IN_PROGRESS;
      await tasksRepository.save(mockTask);
      const result = mockTask.status;
      expect(result).toEqual(TaskStatus.IN_PROGRESS);
    });
  });
});
