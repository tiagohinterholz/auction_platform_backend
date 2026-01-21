# Auction Platform – API Contracts

## 1. Purpose

This document defines the **public API contracts** for the Auction Platform MVP.

The contracts describe:
- REST endpoints
- WebSocket events
- Request and response payloads
- Responsibilities per bounded context

This document is treated as a **contract**, not an implementation detail.

---

## 2. General API Rules

- All APIs are JSON-based
- All timestamps use ISO 8601 (UTC)
- All monetary values use integer cents
- Authentication via JWT (details omitted)

Base URL:

/api/v1

---

## 3. Auction Context – REST API

### 3.1 Create Auction

**Endpoint**
POST /api/v1/auctions

**Request**
```json
{
  "title": "Vintage Watch",
  "startingPrice": 10000,
  "minimumIncrement": 500,
  "startTime": "2026-01-20T18:00:00Z",
  "endTime": "2026-01-20T19:00:00Z",
}
```

**Response**
```json
{
  "auctionId": "uuid",
  "status": "DRAFT"
}
```

### 3.2 Get Auction Details

**Endpoint**
GET /api/v1/auctions{auctionId}

**Response**
```json
{
  "auctionId": "uuid",
  "title": "Vintage Watch",
  "status": "ACTIVE",
  "startingPrice": 10000,
  "minimumIncrement": 500,
  "currentHighestBid": 12500,
  "endTime": "2026-01-20T19:05:00Z"
}
```

### 3.3 Cancel Auction Details
**Endpoint**
POST /api/v1/auctions/{auctionId}/cancel

**Response**
```json
{
  "auctionId": "uuid",
  "status": "CANCELLED"
}
```

## 4. Bidding Context – REST API

### 4.1 Place Bid

**Endpoint**
POST /api/v1/auctions/{auctionId}/bids

**Request**
```json
{
  "amount": 13000
}
```

**Response**
```json
{
  "bidId": "uuid",
  "status": "ACCEPTED"
}
```

### 4.2 List Auction Bids

**Endpoint**
GET /api/v1/auctions/{auctionId}/bids

**Response**
```json
[
  {
    "bidId": "uuid",
    "bidderId": "uuid",
    "amount": 13000,
    "placedAt": "2026-01-20T18:45:00Z"
  }
]
```

## 5. Notification Context – WebSocket API

### 5.1 Connection

**Endpoint**
WS /ws

### 5.2 Subscribe to Auction

**Message**
```json
{
  "action": "SUBSCRIBE",
  "auctionId": "uuid"
}
```

### 5.3 WebSocket Events

**BidPlaced**
```json
{
  "event": "BidPlaced",
  "auctionId": "uuid",
  "amount": 13000
}
```

**AuctionExtended**
```json
{
  "event": "AuctionExtended",
  "auctionId": "uuid",
  "newEndTime": "2026-01-20T19:05:00Z"
}
```

**AuctionFinished**
```json
{
  "event": "AuctionFinished",
  "auctionId": "uuid",
  "highestBid": 13000
}
```

## 6. Error Handling

**Standard error response format**
```json
{
  "error": "ERROR_CODE",
  "message": "Human-readable description"
}
```

## 7. Idempotency (MVP+)

Bid placement endpoints must be idempotent

Clients may retry requests safely

Duplicate bid submissions must not create inconsistent state

## 8. Responsibilities Summary

   Context   |    Responsibility
Auction      | Lifecycle and timing
Bidding      | Validation and concurrency
Notification | Real-time fan-out
Payment      | Post-auction processing (future)

## 9. Non-Goals

Payment API
Admin dashboards
Fraud detection
Analytics endpoints
These will be added incrementally.


# Auction Platform – MVP Architecture

## 1. Purpose

This document defines the **technical architecture** of the Auction Platform MVP.

The architecture is designed to:
- Preserve bounded context isolation
- Support high concurrency
- Enable async processing
- Be fully runnable using **free tools**
- Allow future extraction to microservices with minimal refactoring

---

## 2. Architecture Style

### 2.1 Architectural Pattern

- **Modular Monolith**
- **Event-driven**
- **Domain-oriented**

Characteristics:
- Single deployment unit
- Clear module boundaries
- Internal event bus
- Infrastructure abstractions

---

## 3. High-Level System Overview

[ Vue 3 Client ]
|
| HTTP / WebSocket
|
[ NestJS API (Modular Monolith) ]
|
| Auction | Bidding | Payment | Notification |
|
[ Internal Event Bus ]
|
[ Redis / BullMQ ]
|
[ PostgreSQL ]


---

## 4. Backend Architecture (NestJS)

### 4.1 Application Structure

src/
├─ auction/
│ ├─ domain/
│ ├─ application/
│ ├─ infrastructure/
| ├─ presentation/
│ └─ auction.module.ts
│
├─ bidding/
│ ├─ domain/
│ ├─ application/
│ ├─ infrastructure/
| ├─ presentation/
│ └─ bidding.module.ts
│
├─ payment/
│ └─ (future)
│
├─ notification/
│ ├─ websocket/
│ └─ notification.module.ts
│
├─ shared/
│ ├─ events/
│ ├─ logging/
│ ├─ locks/
│ └─ database/
│
└─ main.ts


Rules:
- No module imports another module’s **entities**
- Communication via **events only**
- Shared contains **infrastructure**, not domain logic

---

## 5. Database Architecture

### 5.1 Database

- **PostgreSQL**
- Single physical database
- Logical isolation via schemas or table prefixes

Example:

auction_auctions
bidding_bids
payment_payments

Rules:
- No foreign keys across contexts
- No cross-context joins
- Data ownership is strict

---

## 6. Concurrency & Consistency

### 6.1 Concurrency Control

- **Redis distributed lock** per auction
- Lock scope: `auction:{auctionId}`
- Lock TTL to prevent deadlocks

Purpose:
- Guarantee single highest bid
- Prevent race conditions

---

### 6.2 Database Consistency

- Optimistic locking (version column)
- Atomic state transitions
- Idempotent write operations

---

## 7. Async Processing

### 7.1 Queue System

- **BullMQ**
- Redis-backed
- At-least-once delivery

Use cases:
- Auction start scheduler
- Auction finish scheduler
- Payment processing (future)
- Notification fan-out

---

### 7.2 Internal Events

- Domain events emitted after state changes
- Initially handled **in-memory**
- Later replaceable by message broker

---

## 8. Real-Time Communication

### 8.1 WebSocket

- NestJS WebSocket Gateway
- Event-driven push updates

Events pushed to client:
- BidPlaced
- AuctionExtended
- AuctionFinished

Frontend subscribes per auction channel.

---

## 9. Observability

### 9.1 Logging

- **Winston**
- Structured JSON logs
- Log levels: error, warn, info, debug

Each request includes:
- requestId (UUID)
- auctionId (when applicable)

---

### 9.2 Tracing (Optional MVP+)

- OpenTelemetry (local)
- Trace async boundaries
- Prepare for distributed tracing

---

## 10. API Documentation

- Swagger (NestJS)
- Generated from controllers + DTOs
- Treated as **contract**, not convenience

---

## 11. Authentication (MVP)

- JWT-based authentication
- Authorization rules out of scope for domain
- Auction rules are independent of auth mechanism

---

## 12. Containerization

### 12.1 Docker

Services:
- api (NestJS)
- postgres
- redis

Managed via:
- Docker Compose

Goals:
- One-command startup
- Local parity with production

---

## 13. Non-Goals (Explicit)

- Kubernetes
- Service mesh
- Multi-region
- Strong consistency across services
- Exactly-once delivery

---

## 14. Evolution Path

Step-by-step extraction:
1. Replace internal events with Redis queue
2. Extract Payment context
3. Extract Bidding context
4. Introduce independent databases

No business logic rewrite required.

---

## 15. Engineering Principle (Final)

> The architecture must protect the domain from infrastructure decisions.

If infrastructure changes break domain code, the architecture is wrong.


# Auction Business Rules

## 1. Purpose

An **Auction** represents a competitive process where multiple participants place bids on an item within a defined time window.  
The system must guarantee **fairness**, **consistency**, and **correctness**, even under high concurrency.

---

## 2. Core Concepts

### 2.1 Auction

An auction is defined by:

- A starting price
- A minimum bid increment
- A start time
- An end time
- A current highest bid (if any)
- A lifecycle state

An auction exists independently of bids.  
Bids **do not define** an auction; they only interact with it.

---

### 2.2 Bid

A bid represents an offer made by a participant to buy the auctioned item for a given amount.

A bid:

- Belongs to exactly one auction
- Is immutable once accepted
- Is evaluated against the current auction state

---

### 2.3 Participant

A participant is a user eligible to place bids.

Rules related to identity, authentication, or permissions are **out of scope** for this document.

---

## 3. Auction Lifecycle States

An auction can be in **only one** of the following states at any given time:

- **CREATED**  
  The auction exists but has not started yet.

- **ACTIVE**  
  The auction is open and accepts bids.

- **FINISHED**  
  The auction has ended and no longer accepts bids.

- **CANCELLED**  
  The auction was terminated before completion.

An auction **must never** transition outside these states.

---

## 4. State Transitions

### 4.1 Valid Transitions

- `CREATED → ACTIVE`  
  Occurs automatically when the start time is reached.

- `ACTIVE → FINISHED`  
  Occurs automatically when the end time is reached.

- `CREATED → CANCELLED`  
  Occurs if the auction is cancelled before it starts.

- `ACTIVE → CANCELLED`  
  Occurs if the auction is cancelled while active.

---

### 4.2 Invalid Transitions

The following transitions are **not allowed**:

- `FINISHED → ACTIVE`
- `CANCELLED → ACTIVE`
- `FINISHED → CANCELLED`

Once an auction is **FINISHED** or **CANCELLED**, it is terminal.

---

## 5. Bid Rules

### 5.1 General Rules

- A bid can only be placed when the auction is in the **ACTIVE** state.
- Bids placed in any other state **must be rejected**.

---

### 5.2 Bid Amount Validation

A bid is considered **valid** only if:

- The bid amount is strictly greater than:
  - The auction starting price, if no previous bids exist
  - The current highest bid **plus** the minimum increment, if bids exist

If this condition is not met, the bid **must be rejected**.

---

### 5.3 Concurrency Rule (Critical)

If two or more bids are placed **concurrently**:

- Only **one** bid may be accepted as the highest bid.
- The system must ensure that:
  - No two accepted bids violate the bid increment rule
  - Race conditions do not result in inconsistent auction state

The system must behave deterministically, even under high contention.

---

## 6. Time Extension Rule (Anti-sniping)

To prevent last-second bidding advantages:

- If a valid bid is placed within the **final X seconds** of the auction:
  - The auction end time must be extended by **Y seconds**

Default configuration for MVP:
- X = 30 seconds
- Y = 60 seconds

This rule applies **only** to valid bids.

---

## 7. Auction Completion Rules

### 7.1 Automatic Completion

An auction must be marked as **FINISHED** when:

- The current time exceeds the auction end time

After completion:

- No further bids are accepted
- The highest bid (if any) becomes final

---

### 7.2 Auctions Without Bids

If an auction finishes without any valid bids:

- The auction is still considered **FINISHED**
- No winner is assigned

---

## 8. Cancellation Rules

An auction may be cancelled only if:

- It is in the **CREATED** or **ACTIVE** state

When an auction is cancelled:

- No further bids are accepted
- Existing bids remain stored for audit purposes
- The auction is marked as **CANCELLED**

---

## 9. Invariants (Must Always Hold)

At all times, the system must guarantee:

- An auction has **at most one** highest bid
- The highest bid always satisfies the minimum increment rule
- A bid belongs to exactly one auction
- Finished or cancelled auctions never accept bids
- Time-based rules are enforced consistently

Violation of any invariant represents a **system bug**.

---

## 10. Out of Scope

The following concerns are intentionally excluded from this document:

- Payment processing
- User authentication and authorization
- Notifications and UI updates
- Fraud detection

These will be handled in separate domains.


# Auction Domain Events

## 1. Purpose

This document defines the **domain events** related to the Auction system.  
Domain events represent **facts that already happened** and are used to communicate changes between bounded contexts.

Events are immutable and must never be renamed once published.

---

## 2. Event Naming Rules

- Event names are written in **past tense**
- Events describe **what happened**, not what should happen
- Events do not return values
- Events do not enforce behavior; consumers decide how to react

---

## 3. Core Auction Events

### 3.1 AuctionCreated

**Description**  
Emitted when a new auction is created.

**Triggered by**  
Auction service

**Payload**
- `auctionId`
- `startingPrice`
- `minimumIncrement`
- `startTime`
- `endTime`

---

### 3.2 AuctionStarted

**Description**  
Emitted when an auction transitions from CREATED to ACTIVE.

**Triggered by**  
System (time-based scheduler)

**Payload**
- `auctionId`
- `startedAt`

---

### 3.3 BidPlaced

**Description**  
Emitted when a valid bid is accepted.

**Triggered by**  
Bidding service

**Payload**
- `auctionId`
- `bidId`
- `bidderId`
- `amount`
- `placedAt`

---

### 3.4 AuctionExtended

**Description**  
Emitted when the auction end time is extended due to a last-second bid.

**Triggered by**  
Auction service

**Payload**
- `auctionId`
- `previousEndTime`
- `newEndTime`
- `reason` (e.g. `ANTI_SNIPING_RULE`)

---

### 3.5 AuctionFinished

**Description**  
Emitted when an auction reaches its end time and is finalized.

**Triggered by**  
System (time-based scheduler)

**Payload**
- `auctionId`
- `finishedAt`
- `highestBidId` (nullable)

---

### 3.6 AuctionCancelled

**Description**  
Emitted when an auction is cancelled before completion.

**Triggered by**  
Admin or system

**Payload**
- `auctionId`
- `cancelledAt`
- `reason`

---

## 4. Payment-Related Events (Future Scope)

These events are defined now for clarity but will be implemented later.

### 4.1 PaymentRequested

**Description**  
Emitted after an auction is finished and has a winning bid.

**Triggered by**  
Auction service

**Payload**
- `auctionId`
- `bidId`
- `amount`
- `payerId`

---

### 4.2 PaymentCompleted

**Description**  
Emitted when a payment is successfully processed.

**Triggered by**  
Payment service

**Payload**
- `auctionId`
- `paymentId`
- `completedAt`

---

### 4.3 PaymentFailed

**Description**  
Emitted when a payment attempt fails.

**Triggered by**  
Payment service

**Payload**
- `auctionId`
- `paymentId`
- `failedAt`
- `reason`

---

## 5. Event Guarantees

The system must guarantee:

- Events are published **after** state changes
- Events are published **at least once**
- Consumers must be **idempotent**
- Event order is guaranteed **per auction**

---

## 6. Out of Scope

- Event transport technology (in-memory, queue, broker)
- Retry policies
- Dead-letter queues

These concerns will be defined in the infrastructure layer.


# Auction State Diagram

## 1. Purpose

This document defines the **allowed states** of an Auction and the **valid transitions** between them.  
The auction lifecycle must strictly follow these rules.

---

## 2. States

An auction can be in **only one** of the following states at any given time:

- **DRAFT**  
  The auction is creating but has not created yet and can be modify everything.

- **SCHEDULE**  
  The auction is scheduling but has not created yet, Defined dates and not accept bids. Wating the begin.

- **CREATED**  
  The auction has been created but has not started yet and cannot modificate.

- **ACTIVE**  
  The auction is open and accepts bids.

- **FINISHED**  
  The auction has ended and no longer accepts bids.

- **CANCELLED**  
  The auction was terminated before completion.

---

## 3. Allowed Transitions

| From     | To        |  Trigger  |
|----------|-----------|------------------------------|
| CREATED  | ACTIVE    | `start_time` is reached      |
| ACTIVE   | FINISHED  | `end_time` is reached        |
| CREATED  | CANCELLED | Cancelled by admin or system |
| ACTIVE   | CANCELLED | Cancelled by admin or system |

---

## 4. Forbidden Transitions

The following transitions are **not allowed** under any circumstances:

- FINISHED → ACTIVE
- CANCELLED → ACTIVE
- FINISHED → CANCELLED
- CANCELLED → FINISHED

Once an auction reaches **FINISHED** or **CANCELLED**, the state is terminal.

---

## 5. State Transition Rules

- State transitions must be **atomic**
- Time-based transitions must be **deterministic**
- Invalid transitions must be **rejected**
- State changes must be **auditable**

Any violation of these rules indicates a system defect.

---

## 6. Notes

- Bids are accepted **only** when the auction state is **ACTIVE**
- State transitions are driven by **time** or **explicit commands**
- No manual override is allowed for terminal states

---


# Bounded Contexts

## 1. Purpose

This document defines the **bounded contexts** of the Auction Platform.

A bounded context is a boundary within which terms, rules, and models have a single meaning.
Contexts must communicate via **events** or **well-defined APIs**, never by sharing databases or internal models.

---

## 2. Contexts Overview

The platform is divided into the following bounded contexts:

- Auction Context
- Bidding Context
- Payment Context
- Notification Context

---

## 3. Auction Context

### 3.1 Responsibilities

- Owns the Auction lifecycle:
  - creation
  - activation (start)
  - extension (anti-sniping)
  - completion (finish)
  - cancellation
- Owns auction timing rules:
  - start time
  - end time
  - time extension rules
- Owns the auction state machine

### 3.2 Owns Data

- Auction aggregate and state
- Auction configuration:
  - startingPrice
  - minimumIncrement
  - startTime / endTime

### 3.3 Publishes Events

- AuctionStarted
- AuctionExtended
- AuctionFinished
- AuctionCancelled

### 3.4 Consumes Events

- BidPlaced (from Bidding Context)

---

## 4. Bidding Context

### 4.1 Responsibilities

- Accepts bids and validates bid rules:
  - auction must be ACTIVE
  - bid amount must be greater than highest bid + minimum increment
- Enforces concurrency rules so only one bid becomes the highest bid under contention
- Stores bid history for auditability

### 4.2 Owns Data

- Bid records
- Highest bid reference per auction (implementation detail, must be consistent)

### 4.3 Publishes Events

- BidPlaced

### 4.4 Consumes Events

- AuctionStarted
- AuctionFinished
- AuctionCancelled

---

## 5. Payment Context (Future Scope)

### 5.1 Responsibilities

- Handles payment after auction completion
- Applies retry and failure handling
- Emits payment outcome events

### 5.2 Owns Data

- Payment transaction records
- Payment status

### 5.3 Publishes Events

- PaymentCompleted
- PaymentFailed

### 5.4 Consumes Events

- PaymentRequested

---

## 6. Notification Context

### 6.1 Responsibilities

- Real-time updates to clients (WebSocket)
- Fan-out of changes:
  - new bids
  - auction extended
  - auction finished
- User-facing notifications (optional later)

### 6.2 Owns Data

- None required for MVP (can be stateless)

### 6.3 Publishes Events

- None required for MVP

### 6.4 Consumes Events

- BidPlaced
- AuctionExtended
- AuctionFinished
- AuctionCancelled

---

## 7. Communication Rules

The following rules must be enforced:

- Contexts must not share database tables
- Contexts must not import internal models from each other
- Contexts communicate by:
  - domain events (preferred)
  - explicit APIs (only when necessary)

---

## 8. MVP Execution Strategy (Important)

For the MVP, contexts will be implemented as **modules inside a single NestJS application**, preserving boundaries:

- Separate folders/modules per context
- No cross-import of entities
- Event-driven communication internally (in-memory event bus)

Later, contexts can be extracted into microservices by replacing:
- internal events → message broker (Redis/BullMQ, RabbitMQ, Kafka)
- internal calls → HTTP or async messaging
