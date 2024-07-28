let mockData = [
  { id: 1, title: 'React学習', time: 2 },
  { id: 2, title: 'Jest学習', time: 1 },
];

const mockSupabase = {
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockResolvedValue({ data: mockData, error: null }),
  insert: jest.fn().mockResolvedValue({ data: null, error: null }),
  delete: jest.fn().mockReturnThis(),
  eq: jest.fn().mockImplementation((column, value) => {
    mockData = mockData.filter(item => item[column] !== value);
    return { data: null, error: null };
  }),
};

export const getSupabase = jest.fn(() => mockSupabase);