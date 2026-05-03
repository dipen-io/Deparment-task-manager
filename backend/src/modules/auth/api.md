GET http://localhost:8081/api/v1/tasks
GET http://localhost:8081/api/v1/tasks?status=pending
GET http://localhost:8081/api/v1/tasks?page=2
GET http://localhost:8081/api/v1/tasks?page=1&limit=3
GET http://localhost:8081/api/v1/tasks?page=1&limit=100
GET http://localhost:8081/api/v1/tasks?status=pending&page=2&limit=5

Find tasks for one employee: GET http://localhost:8081/api/v1/tasks?assignedTo=65b8c9f1...
Search for a keyword: GET http://localhost:8081/api/v1/tasks?search=database
The Ultimate Combo: GET http://localhost:8081/api/v1/tasks?status=completed&assignedTo=65b8c9f1...&search=dashboard&page=1&limit=10
