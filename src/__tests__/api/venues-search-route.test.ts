// 1) Mock NextResponse.json (Next runtime APIs aren’t available in Jest)
jest.mock('next/server', () => ({
  NextResponse: {
    json: (data: any) =>
      new Response(JSON.stringify(data), {
        headers: { 'content-type': 'application/json' },
      }),
  },
}))

// 2) Mock the Holidaze API wrapper to return a tiny fixture dataset
jest.mock('@/lib/holidaze', () => ({
  holidazeApi: jest.fn().mockResolvedValue({
    data: [
      {
        id: 'v1',
        name: 'Cozy Cabin',
        description: 'Forest cabin',
        price: 100,
        maxGuests: 4,
        media: [],
        rating: 0,
        created: '2024-01-01',
        updated: '2024-01-01',
        meta: {},
        location: {},
        bookings: [
          { id: 'b1', dateFrom: '2025-02-10', dateTo: '2025-02-12', guests: 2 },
        ],
      },
      {
        id: 'v2',
        name: 'Oslo Apartment',
        description: 'City view',
        price: 150,
        maxGuests: 2,
        media: [],
        rating: 0,
        created: '2024-02-01',
        updated: '2024-02-01',
        meta: {},
        location: {},
        bookings: [],
      },
    ],
  }),
}))

// 3) Now import the route AFTER the mocks
import { GET } from '@/app/api/venues/search/route'

describe('/api/venues/search', () => {
  it('responds with JSON envelope', async () => {
    const req = new Request(
      'http://localhost/api/venues/search?q=oslo&page=1&limit=12'
    )
    const res = await GET(req)
    const json = await res.json()

    expect(json).toHaveProperty('data')
    expect(json).toHaveProperty('meta')
    expect(json.meta).toEqual(
      expect.objectContaining({
        currentPage: 1,
        pageCount: expect.any(Number),
        totalCount: expect.any(Number),
      })
    )
    // Should include "Oslo Apartment"
    expect(json.data.some((v: any) => v.name.includes('Oslo'))).toBe(true)
  })
})
