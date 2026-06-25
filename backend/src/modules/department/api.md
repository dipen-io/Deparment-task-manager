creating departments
  * POST /api/v1/dept
    {
        "name" : "new desc updated",
        "description": "updated desc "
        "manager" : "6a087e821879d1cbfe7810f9"
    }

fetching departments with query params
    > first page
      * GET /api/v1/dept/get?limit=10
    > next page
      * GET /api/v1/dept/get?limit=10&cursor=2024-01-15T10:30:00.000Z
   > with search
      * GET /api/v1/dept/get?search=engineering&limit=10
   > Sort asceding by name
      * GET /api/v1/dept/get?sortBy=name&sortOrder=asc&limit=10


update 
    PATCH  /api/v1/dept/6a3cf35d1c64262a6999c8cd
    {
        "name" : "new desc updated",
        "description": "updated desc "
        "manager" : "6a087e821879d1cbfe7810f9"
    }

delete 

    DELETE  /api/v1/dept/6a3cf35d1c64262a6999c8cd
