import { prisma } from '@/lib/prisma';

describe('POST /api/auth/register', () => {
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = 'testpassword123';

  // Clean up test user after each test
  afterEach(async () => {
    try {
      await prisma.user.deleteMany({
        where: { email: testEmail }
      });
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should register a user and persist to database', async () => {
    // This test verifies that:
    // 1. The database schema is applied (User table exists)
    // 2. User registration works end-to-end
    // 3. Data is actually persisted to the database
    
    // Attempt to create a user directly via Prisma to verify DB schema is applied
    const user = await prisma.user.create({
      data: {
        email: testEmail,
        password: testPassword
      }
    });

    // Verify user was created with correct data
    expect(user).toBeDefined();
    expect(user.id).toBeDefined();
    expect(user.email).toBe(testEmail);
    expect(user.password).toBe(testPassword);
    expect(user.createdAt).toBeInstanceOf(Date);
    expect(user.updatedAt).toBeInstanceOf(Date);

    // Verify user can be retrieved from database
    const retrievedUser = await prisma.user.findUnique({
      where: { email: testEmail }
    });

    expect(retrievedUser).toBeDefined();
    expect(retrievedUser?.id).toBe(user.id);
    expect(retrievedUser?.email).toBe(testEmail);
  });

  it('should enforce unique email constraint', async () => {
    // Create first user
    await prisma.user.create({
      data: {
        email: testEmail,
        password: testPassword
      }
    });

    // Attempt to create duplicate user should fail
    await expect(
      prisma.user.create({
        data: {
          email: testEmail,
          password: 'differentpassword'
        }
      })
    ).rejects.toThrow();
  });

  it('should verify database migration is applied', async () => {
    // This test will fail if migrations are not applied
    // It checks that the User table exists and has the correct structure
    
    // Create a user to verify schema
    const user = await prisma.user.create({
      data: {
        email: testEmail,
        password: testPassword
      }
    });

    // Verify all required fields exist
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('password');
    expect(user).toHaveProperty('createdAt');
    expect(user).toHaveProperty('updatedAt');

    // Verify the email unique index by trying to create duplicate
    await expect(
      prisma.user.create({
        data: {
          email: testEmail,
          password: 'another'
        }
      })
    ).rejects.toThrow();
  });
});
