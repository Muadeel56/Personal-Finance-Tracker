# Reports

## Reports

### List Reports
- **GET** `/reports/reports/`
- List all reports for the authenticated user.
- **Auth:** Required

### Create Report
- **POST** `/reports/reports/`
- **Request:**
```json
{
  "name": "Monthly Spending",
  "type": "summary"
}
```
- **Response:**
```json
{
  "id": 1,
  "name": "Monthly Spending",
  "type": "summary",
  "created_at": "2024-06-01T12:00:00Z"
}
```
- **Auth:** Required

### Get/Update/Delete Report
- **GET** `/reports/reports/{id}/`
- **PUT/PATCH** `/reports/reports/{id}/`
- **DELETE** `/reports/reports/{id}/`
- **Auth:** Required

---

## Report Schedules

### List Report Schedules
- **GET** `/reports/report-schedules/`
- List all report schedules.
- **Auth:** Required

### Create Report Schedule
- **POST** `/reports/report-schedules/`
- **Request:**
```json
{
  "report": 1,
  "frequency": "monthly"
}
```
- **Response:**
```json
{
  "id": 1,
  "report": 1,
  "frequency": "monthly"
}
```
- **Auth:** Required

### Get/Update/Delete Report Schedule
- **GET** `/reports/report-schedules/{id}/`
- **PUT/PATCH** `/reports/report-schedules/{id}/`
- **DELETE** `/reports/report-schedules/{id}/`
- **Auth:** Required

---

## Report Exports

### List Report Exports
- **GET** `/reports/report-exports/`
- List all report exports.
- **Auth:** Required

### Create Report Export
- **POST** `/reports/report-exports/`
- **Request:**
```json
{
  "report": 1,
  "format": "csv"
}
```
- **Response:**
```json
{
  "id": 1,
  "report": 1,
  "format": "csv",
  "created_at": "2024-06-01T12:00:00Z"
}
```
- **Auth:** Required

### Get/Update/Delete Report Export
- **GET** `/reports/report-exports/{id}/`
- **PUT/PATCH** `/reports/report-exports/{id}/`
- **DELETE** `/reports/report-exports/{id}/`
- **Auth:** Required 