import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser, withAuth } from '../server';
import { createServerClient } from '@/lib/supabase/server';
import type { User } from '@supabase/supabase-js';

// Mock the Supabase server client
vi.mock('@/lib/supabase/server', () => ({
  createServerClient: vi.fn()
}));

// Mock Next.js server components
vi.mock('next/headers', () => ({
  cookies: vi.fn(() => Promise.resolve({
    getAll: vi.fn(() => []),
    set: vi.fn()
  }))
}));

const mockCreateServerClient = createServerClient as Mock;

describe('Authentication Server', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAuthenticatedUser', () => {
    it('should return user when authentication is successful', async () => {
      const mockUser: User = {
        id: '123',
        email: 'test@example.com',
        created_at: new Date().toISOString(),
        aud: 'authenticated',
        role: 'authenticated',
        updated_at: new Date().toISOString(),
        app_metadata: {},
        user_metadata: {},
        identities: [],
        factors: []
      };

      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: mockUser },
            error: null
          })
        }
      };

      mockCreateServerClient.mockResolvedValue(mockSupabase);

      const result = await getAuthenticatedUser();

      expect(result.user).toEqual(mockUser);
      expect(result.error).toBeNull();
      expect(mockSupabase.auth.getUser).toHaveBeenCalledOnce();
    });

    it('should return error when user is not authenticated', async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: null },
            error: null
          })
        }
      };

      mockCreateServerClient.mockResolvedValue(mockSupabase);

      const result = await getAuthenticatedUser();

      expect(result.user).toBeNull();
      expect(result.error).toBe('Authentication required');
    });

    it('should return error when Supabase auth fails', async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: null },
            error: new Error('Invalid token')
          })
        }
      };

      mockCreateServerClient.mockResolvedValue(mockSupabase);

      const result = await getAuthenticatedUser();

      expect(result.user).toBeNull();
      expect(result.error).toBe('Authentication required');
    });

    it('should handle exceptions gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockCreateServerClient.mockRejectedValue(new Error('Database connection failed'));

      const result = await getAuthenticatedUser();

      expect(result.user).toBeNull();
      expect(result.error).toBe('Authentication failed');
      expect(consoleSpy).toHaveBeenCalledWith('Auth error:', expect.any(Error));
      
      consoleSpy.mockRestore();
    });
  });

  describe('withAuth', () => {
    it('should call handler with authenticated user', async () => {
      const mockUser: User = {
        id: '123',
        email: 'test@example.com',
        created_at: new Date().toISOString(),
        aud: 'authenticated',
        role: 'authenticated',
        updated_at: new Date().toISOString(),
        app_metadata: {},
        user_metadata: {},
        identities: [],
        factors: []
      };

      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: mockUser },
            error: null
          })
        }
      };

      mockCreateServerClient.mockResolvedValue(mockSupabase);

      const mockHandler = vi.fn().mockResolvedValue(
        NextResponse.json({ success: true })
      );

      const protectedHandler = withAuth(mockHandler);
      const request = new NextRequest('http://localhost:3000/api/test');

      await protectedHandler(request);

      expect(mockHandler).toHaveBeenCalledWith(
        request,
        { user: mockUser }
      );
    });

    it('should return 401 when user is not authenticated', async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: null },
            error: null
          })
        }
      };

      mockCreateServerClient.mockResolvedValue(mockSupabase);

      const mockHandler = vi.fn();
      const protectedHandler = withAuth(mockHandler);
      const request = new NextRequest('http://localhost:3000/api/test');

      const response = await protectedHandler(request);
      const responseData = await response.json();

      expect(response.status).toBe(401);
      expect(responseData.error).toBe('Authentication required');
      expect(mockHandler).not.toHaveBeenCalled();
    });

    it('should return 401 with custom error when auth fails', async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: null },
            error: new Error('Token expired')
          })
        }
      };

      mockCreateServerClient.mockResolvedValue(mockSupabase);

      const mockHandler = vi.fn();
      const protectedHandler = withAuth(mockHandler);
      const request = new NextRequest('http://localhost:3000/api/test');

      const response = await protectedHandler(request);
      const responseData = await response.json();

      expect(response.status).toBe(401);
      expect(responseData.error).toBe('Authentication required');
      expect(mockHandler).not.toHaveBeenCalled();
    });

    it('should pass additional arguments to handler', async () => {
      const mockUser: User = {
        id: '123',
        email: 'test@example.com',
        created_at: new Date().toISOString(),
        aud: 'authenticated',
        role: 'authenticated',
        updated_at: new Date().toISOString(),
        app_metadata: {},
        user_metadata: {},
        identities: [],
        factors: []
      };

      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: mockUser },
            error: null
          })
        }
      };

      mockCreateServerClient.mockResolvedValue(mockSupabase);

      const mockHandler = vi.fn().mockResolvedValue(
        NextResponse.json({ success: true })
      );

      const protectedHandler = withAuth(mockHandler);
      const request = new NextRequest('http://localhost:3000/api/test');
      const additionalArg = { params: { id: '456' } };

      await protectedHandler(request, additionalArg);

      expect(mockHandler).toHaveBeenCalledWith(
        request,
        { user: mockUser },
        additionalArg
      );
    });

    it('should handle handler exceptions', async () => {
      const mockUser: User = {
        id: '123',
        email: 'test@example.com',
        created_at: new Date().toISOString(),
        aud: 'authenticated',
        role: 'authenticated',
        updated_at: new Date().toISOString(),
        app_metadata: {},
        user_metadata: {},
        identities: [],
        factors: []
      };

      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: mockUser },
            error: null
          })
        }
      };

      mockCreateServerClient.mockResolvedValue(mockSupabase);

      const mockHandler = vi.fn().mockRejectedValue(new Error('Handler error'));
      const protectedHandler = withAuth(mockHandler);
      const request = new NextRequest('http://localhost:3000/api/test');

      await expect(protectedHandler(request)).rejects.toThrow('Handler error');
      expect(mockHandler).toHaveBeenCalledWith(request, { user: mockUser });
    });
  });
});