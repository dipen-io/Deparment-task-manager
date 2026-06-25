creating departments
  * POST /api/v1/dept

fetching departments with query params
    > first page
      * GET /api/v1/dept/get?limit=10
    > next page
      * GET /api/v1/dept/get?limit=10&cursor=2024-01-15T10:30:00.000Z
   > with search
      * GET /api/v1/dept/get?search=engineering&limit=10
   > Sort asceding by name
      * GET /api/v1/dept/get?sortBy=name&sortOrder=asc&limit=10
