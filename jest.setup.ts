import "jest-extended";

jest.setTimeout(10000);

beforeAll(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
});

afterAll(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
});
