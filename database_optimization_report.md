# Database Optimization Report

This report outlines the database design, indexing strategy, and optimization techniques implemented to scale the Mini Employee Management System.

---

## 1. Indexing Strategy & Schema Enhancements

To optimize lookups and ensure fast query execution as the database grows, we updated the Prisma schema (`schema.prisma`) with explicit index annotations (`@@index`) for foreign keys and frequently searched columns.

### Index Selections and Rationale

| Target Model | Index Definition | Primary Queries Optimized | Rationale |
| :--- | :--- | :--- | :--- |
| **Employee** | `@@index([department_id])` | Department listings, join queries. | Speeds up filtering employees by department and matching department names during JOINS. |
| **EmployeeDocument** | `@@index([employee_id])` | Fetching attachments/images for a profile. | Speeds up lookup of profile images, resumes, and identification documents for a specific employee. |
| **EmployeeSkill** | `@@index([employee_id])`, `@@index([skill_id])` | Many-to-many lookup of skillsets. | Resolves join lookups between employees and skills rapidly, avoiding full-table scans. |
| **LeaveApplication** | `@@index([employee_id])`, `@@index([status])`, `@@index([leave_type_id])` | Leave histories, pending reviews, leave stats. | Optimizes dashboard list queries (e.g., retrieving only "Pending" leaves or filter-by-employee history). |
| **ApprovalHistory** | `@@index([leave_id])` | Leave application audit trail. | Connects approval stages and remarks back to the parent leave request cleanly. |
| **AssetAllocation** | `@@index([employee_id])`, `@@index([asset_id])`, `@@index([status])` | Asset tracking, inventory reports, returns. | Speeds up checking who holds a specific asset, active allocations, or list of assets per employee. |
| **AssetHistory** | `@@index([asset_id])` | Maintenance/change log lookup. | Optimizes loading the history logs of status transitions for a specific asset. |
| **Notification** | `@@index([user_id])`, `@@index([is_read])` | Pulling unread alerts for log-in users. | Crucial for the header alert counter which queries `is_read = false` for the authenticated user on every page load. |
| **AuditLog** | `@@index([record_id])`, `@@index([table_name])` | Tracking history of specific resources. | Supports quick rendering of history trails for auditing. |

---

## 2. Performance Benefits for Query Lookups

### Why Add Indexes?
In a relational database (PostgreSQL in this system):
- **Full Table Scans Avoided:** Without indexes, database queries involving search criteria (`WHERE status = 'Pending'`) or joins must scan every single row in the table (O(N) time complexity). Indexes create a B-Tree structure that allows the engine to locate matching rows in logarithmic time (O(log N)).
- **Join Optimization:** During SQL `JOIN` queries (e.g., matching `Employee` with `Department` and `Skills`), indexes on the join columns allow the database optimizer to use fast nested loops or merge joins instead of expensive hash joins.

---

## 3. Transaction Safety Patterns

For critical business flows where database integrity is paramount, we enforce transaction boundary controls using Prisma’s transaction API. 

### Leave Application Final Approval
In the `leaveController.js` file, the `hrApproveLeave` handler utilizes an **interactive transaction** (`prisma.$transaction`) to process approvals:

```javascript
await prisma.$transaction(async (tx) => {
  // Step 1: Update Leave Status
  await tx.leaveApplication.update({
    where: { id: leaveId },
    data: { status: "Approved" }
  });

  // Step 2: Atomically Decrement Available Leave Days
  await tx.leaveBalance.updateMany({
    where: {
      employee_id: leave.employee_id,
      leave_type_id: leave.leave_type_id
    },
    data: {
      available_days: {
        decrement: leave.total_days
      }
    }
  });

  // Step 3: Record in Approval History Audit Trail
  await tx.approvalHistory.create({
    data: {
      leave_id: leaveId,
      approved_by: parseInt(req.body.approvedBy),
      action: "HR Approved",
      remarks: req.body.remarks || null
    }
  });
});
```

### Why This Design is Secure:
1. **Atomicity (All-or-Nothing):** If any statement fails (e.g., DB connection loss during the audit trail creation or schema constraint violations), Prisma rolls back the entire batch. It is impossible to have an approved leave request without updating the employee's balance, preventing "free leaves."
2. **Concurrency Safety:** By executing updates within a single transaction blocks, it prevents race conditions where concurrent updates could result in double-deduction or stale balances.
