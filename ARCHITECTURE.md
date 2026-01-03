# 📸 Photobooth System Architecture

## 🏗️ System Components

```
┌─────────────────────────────────────────────────────────────────┐
│                         TECH SPRINT 3.0                          │
│                      PHOTOBOOTH SYSTEM v1.0                      │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┐                                  ┌──────────────────┐
│                  │                                  │                  │
│  PIXEL DEVICE    │◄────── Staff Operates ────────►│  PARTICIPANTS    │
│  (Staff Use)     │                                  │  (Select Photo)  │
│                  │                                  │                  │
└────────┬─────────┘                                  └────────┬─────────┘
         │                                                      │
         │                                                      │
         ▼                                                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                                                                   │
│                      FIREBASE BACKEND                             │
│  ┌───────────────┐  ┌──────────────┐  ┌──────────────────────┐ │
│  │  Firestore    │  │   Storage    │  │   Authentication     │ │
│  │  Collections  │  │   Buckets    │  │   (Existing)         │ │
│  │               │  │              │  │                      │ │
│  │ • printQueue  │  │ • photobooth/│  │ • Users              │ │
│  │ • checkins    │  │   {userId}/  │  │ • Roles (staff)      │ │
│  │ • registr...  │  │   photo.jpg  │  │                      │ │
│  └───────┬───────┘  └──────┬───────┘  └──────────────────────┘ │
│          │                  │                                    │
└──────────┼──────────────────┼────────────────────────────────────┘
           │                  │
           │                  │ Real-time Sync
           │                  │
           ▼                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                                                                   │
│                  PRINTER STATION COMPUTER                         │
│                    (Always-On Client)                             │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Browser: /printer/client                                  │ │
│  │  • Real-time Firestore listener (onSnapshot)              │ │
│  │  • Wake Lock API (prevents sleep)                          │ │
│  │  • Auto-print on new jobs                                  │ │
│  │  • 3-attempt retry logic                                   │ │
│  │  • Connection monitoring + heartbeat                       │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
└────────────────────────────┬──────────────────────────────────────┘
                             │
                             │ Print Command
                             ▼
                   ┌────────────────────┐
                   │                    │
                   │   WiFi PRINTER     │
                   │  (Physical Device) │
                   │                    │
                   │  • Full-size print │
                   │  • No margins      │
                   │  • High quality    │
                   │                    │
                   └────────────────────┘
```

---

## 📊 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        USER JOURNEY                                  │
└─────────────────────────────────────────────────────────────────────┘

1️⃣  SCAN QR CODE
    ┌─────────────────┐
    │ Staff Scanner   │
    │ /staff/scanner  │
    └────────┬────────┘
             │
             ├─ Check: User checked in? ✓
             ├─ Check: Payment captured? ✓
             ├─ Check: Already printed? ✗
             │
             ▼
    Record to Firestore:
    checkins/{id} = { userId, type: "photobooth", timestamp }
             │
             ▼
    Redirect to capture page

2️⃣  TAKE PHOTOS
    ┌────────────────────────┐
    │ Staff Camera Interface │
    │ /photobooth/capture    │
    └───────────┬────────────┘
                │
                ├─ Activate: Back camera (4000x3000)
                ├─ Capture: Multiple photos (3-5)
                ├─ Canvas: imageSmoothingQuality = 'high'
                ├─ Export: toDataURL("image/jpeg", 0.95)
                │
                ▼
    Upload to Firebase Storage:
    photobooth/{userId}/{timestamp}_0.jpg
    photobooth/{userId}/{timestamp}_1.jpg
    photobooth/{userId}/{timestamp}_2.jpg
                │
                ▼
    Redirect to selection page

3️⃣  SELECT FAVORITE
    ┌───────────────────────┐
    │ Client Selection Page │
    │ /photobooth/select    │
    └──────────┬────────────┘
               │
               ├─ List: All photos from Storage
               ├─ Display: Grid layout
               ├─ Check: Already printed? ✗
               │
               ▼
    User clicks photo + "Print Selected Photo"
               │
               ▼
    Add to Firestore:
    printQueue/{id} = {
      userId, userName, teamName,
      photoUrl, status: "pending",
      createdAt: NOW
    }
               │
               ▼
    Show success screen

4️⃣  AUTO-PRINT
    ┌────────────────────┐
    │ Printer Client     │
    │ /printer/client    │
    └─────────┬──────────┘
              │
              ▼ Real-time listener detects new job
              │
    Update Firestore:
    printQueue/{id}.status = "printing"
              │
              ▼
    Create iframe with print template:
    <style>@page { margin: 0mm; }</style>
    <img src="{photoUrl}" />
              │
              ▼
    iframe.contentWindow.print()
              │
              ├─ Success? ✓
              │   └─► Update: status = "completed", printedAt = NOW
              │
              └─ Failure? ✗
                  └─► Retry (max 3 attempts)
                      └─► Final failure: status = "failed"

5️⃣  PUBLIC GALLERY
    ┌────────────────────┐
    │ Gallery Page       │
    │ /photobooth/gallery│
    └─────────┬──────────┘
              │
              ▼
    Query Firestore:
    printQueue WHERE status == "completed"
              │
              ▼
    Display: Grid of all printed photos
    Filter: By team or classroom
    Real-time: onSnapshot listener
```

---

## 🔒 Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   FIREBASE SECURITY LAYERS                   │
└─────────────────────────────────────────────────────────────┘

Layer 1: Authentication
─────────────────────────
• All routes require: request.auth != null
• Firebase Auth tokens verified server-side

Layer 2: Role-Based Access
───────────────────────────
• Camera interface: Staff/Admin only
• Scanner: Staff/Admin only
• Gallery: All authenticated users
• Printer client: No special role (runs as authenticated user)

Layer 3: Firestore Rules
─────────────────────────
printQueue Collection:
  ├─ Read: Any authenticated user
  ├─ Create: Staff/Admin only (checked via registrations/{uid}.role)
  ├─ Update: Any authenticated user (for status changes)
  └─ Delete: Admin only

checkins Collection:
  └─ (Existing rules apply - staff/admin can create)

Layer 4: Storage Rules
──────────────────────
photobooth/ Bucket:
  ├─ Read: Any authenticated user (for gallery)
  ├─ Write: Staff/Admin only
  └─ Delete: Admin only

Layer 5: Application Logic
───────────────────────────
• Duplicate prevention: Triple check (scanner, selection, queue)
• Check-in enforcement: Query checkins before allowing photobooth
• Payment verification: Check payment_status == "captured"
• One print per person: Query printQueue for existing completed prints
```

---

## 🔄 State Machine (Print Status)

```
┌─────────────────────────────────────────────────────────────┐
│                   PRINT JOB LIFECYCLE                        │
└─────────────────────────────────────────────────────────────┘

                  ┌─────────────┐
                  │   PENDING   │  (User selected photo)
                  └──────┬──────┘
                         │
                         │ Printer client detects (onSnapshot)
                         ▼
                  ┌─────────────┐
                  │  PRINTING   │  (Print command sent)
                  └──────┬──────┘
                         │
                    ┌────┴────┐
                    │         │
                Success?    Failure?
                    │         │
                    ▼         ▼
            ┌────────────┐   ┌──────────┐
            │ COMPLETED  │   │  RETRY   │  (Attempt 2/3)
            └────────────┘   └─────┬────┘
                 │                  │
                 │            ┌─────┴─────┐
                 │            │           │
                 │         Success?    Failure?
                 │            │           │
                 │            ▼           ▼
                 │      ┌────────────┐   ┌──────────┐
                 │      │ COMPLETED  │   │  RETRY   │ (Attempt 3/3)
                 │      └────────────┘   └─────┬────┘
                 │                             │
                 │                       ┌─────┴─────┐
                 │                       │           │
                 │                    Success?    Failure?
                 │                       │           │
                 │                       ▼           ▼
                 │                 ┌────────────┐   ┌──────────┐
                 │                 │ COMPLETED  │   │  FAILED  │
                 │                 └────────────┘   └──────────┘
                 │                       │                 │
                 └───────────────────────┴─────────────────┘
                                         │
                                         ▼
                              Visible in public gallery
                              (if status == "completed")

Status Transitions:
─────────────────
• pending → printing (Printer client starts job)
• printing → completed (Print successful)
• printing → pending (Retry attempt)
• printing → failed (All retries exhausted)

Timestamps:
──────────
• createdAt: When user selects photo
• printedAt: When status becomes "completed"
```

---

## 🌐 Network Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   EVENT VENUE NETWORK                        │
└─────────────────────────────────────────────────────────────┘

                    ┌───────────────┐
                    │  WiFi Router  │
                    │  (Event WiFi) │
                    └───────┬───────┘
                            │
              ┌─────────────┼─────────────┐
              │             │             │
              ▼             ▼             ▼
     ┌────────────┐  ┌───────────┐  ┌──────────┐
     │   Pixel    │  │  Printer  │  │  WiFi    │
     │   Device   │  │ Computer  │  │ Printer  │
     └────────────┘  └───────────┘  └──────────┘
          │               │               │
          │               │               │
          └───────────────┼───────────────┘
                          │
                          │ Internet
                          ▼
                ┌──────────────────┐
                │  FIREBASE CLOUD  │
                │                  │
                │ • Firestore DB   │
                │ • Cloud Storage  │
                │ • Auth Service   │
                └──────────────────┘

Connection Requirements:
───────────────────────
• Pixel Device: WiFi + Internet (for Firebase sync)
• Printer Computer: WiFi + Internet (for Firebase sync)
• WiFi Printer: WiFi (for print commands from computer)
• All devices on same network (recommended but not required)

Bandwidth Usage (Estimated):
────────────────────────────
• Photo upload (4K): ~2-5 MB per photo
• Photo download (printer): ~2-5 MB per photo
• Firestore sync: < 1 KB per transaction
• Total per participant: ~6-15 MB (3 photos captured, 1 printed)
```

---

## 🔧 Technology Stack

```
┌─────────────────────────────────────────────────────────────┐
│                    TECHNOLOGY LAYERS                         │
└─────────────────────────────────────────────────────────────┘

Frontend Framework
──────────────────
• Next.js 14+ (React framework)
• TypeScript (type-safe development)
• Tailwind CSS (styling)
• Material-UI Icons (UI components)

Browser APIs
────────────
• MediaDevices API (camera access)
• Wake Lock API (prevent sleep)
• Canvas API (image processing)
• Print API (iframe.contentWindow.print())

Backend Services (Firebase)
────────────────────────────
• Firestore Database (real-time data sync)
• Cloud Storage (photo hosting)
• Authentication (user management)
• Security Rules (access control)

Libraries
─────────
• html5-qrcode (QR scanner)
• qrcode (QR generation - optional)
• firebase SDK (v9+ modular)

Device Requirements
───────────────────
• Pixel Device: Modern Android with camera
• Printer Computer: Windows/Mac with modern browser
• WiFi Printer: Any network printer

Browser Support
───────────────
• Chrome 90+ (recommended)
• Edge 90+ (recommended)
• Safari 14+ (limited Wake Lock)
• Firefox 89+ (limited Wake Lock)
```

---

## 📈 Performance Characteristics

```
┌─────────────────────────────────────────────────────────────┐
│                    PERFORMANCE METRICS                       │
└─────────────────────────────────────────────────────────────┘

Latency Measurements
────────────────────
• Camera activation: 1-3 seconds
• Photo capture: < 1 second
• Canvas processing: < 1 second
• Storage upload (per photo): 2-5 seconds
• Firestore write: < 1 second
• Real-time sync: < 1 second
• Print trigger: < 1 second
• Physical print: 30-60 seconds (printer-dependent)

Total Time Per User
───────────────────
• Scanner to photo capture: 5 seconds
• Taking 3 photos: 15 seconds
• Upload: 10 seconds
• Selection: 20 seconds
• Print trigger: 2 seconds
• Physical print: 45 seconds
─────────────────────────
TOTAL: ~97 seconds (~1.5 minutes)

Throughput Capacity
───────────────────
• Max simultaneous captures: 1 (single Pixel device)
• Max print queue size: Unlimited (Firestore)
• Max concurrent prints: 1 (single printer)
• Realistic throughput: 20-30 participants/hour
• Event capacity (8 hours): 160-240 participants

Scalability
───────────
• Bottleneck: Single printer (30-60 sec per print)
• Solution: Add more printer computers + printers
• Each additional printer: +20-30 participants/hour
• Horizontal scaling: Linear with printer count

Resource Usage
──────────────
• Firebase Storage: ~5 MB per participant (3 photos)
• Firestore reads: ~10 per participant
• Firestore writes: ~3 per participant
• Network bandwidth: ~15 MB per participant
• Browser memory: ~200 MB (printer client)

Cost Estimates (Firebase)
──────────────────────────
For 200 participants:
• Storage: 1 GB = $0.026/month
• Firestore reads: 2000 = $0.00036
• Firestore writes: 600 = $0.00054
• Network egress: 3 GB = $0.12
─────────────────────────
TOTAL: ~$0.15 for 200 participants
```

---

## 🛡️ Reliability & Fault Tolerance

```
┌─────────────────────────────────────────────────────────────┐
│                   FAILURE MODES & RECOVERY                   │
└─────────────────────────────────────────────────────────────┘

Component Failures
──────────────────

1. Pixel Device Camera Fails
   └─► Fallback: Lower resolution (1920x1440)
   └─► Manual: Use backup device
   └─► Impact: Medium (workflow stops)

2. WiFi Connection Lost
   └─► Auto-recovery: Firebase SDK reconnects
   └─► Manual: Check network, refresh page
   └─► Impact: High (uploads fail)

3. Printer Jams
   └─► Auto-recovery: 3 retry attempts
   └─► Manual: Clear jam, system retries
   └─► Impact: Low (queue buffers jobs)

4. Printer Computer Crashes
   └─► Auto-recovery: None (manual restart)
   └─► Manual: Reopen /printer/client
   └─► Impact: Medium (prints queue until restart)

5. Firebase Quotas Exceeded
   └─► Auto-recovery: None (upgrade plan)
   └─► Prevention: Monitor usage
   └─► Impact: Critical (system stops)

Redundancy Strategies
─────────────────────
• ✓ Retry logic: 3 attempts on failures
• ✓ Auto-reconnect: Firestore listener
• ✓ Queue buffering: Jobs persist in database
• ✓ Wake Lock: Prevents screen sleep
• ✓ Heartbeat: Monitors connection health
• ✗ Multi-device: Single Pixel (bottleneck)
• ✗ Load balancing: Single printer (bottleneck)

Data Persistence
────────────────
• Photos: Permanently stored in Firebase Storage
• Print queue: Permanently stored in Firestore
• User data: Referenced from registrations
• No local storage: All data in cloud

Recovery Time Objectives
─────────────────────────
• Camera failure: < 1 minute (device swap)
• Network loss: < 30 seconds (auto-reconnect)
• Printer jam: < 2 minutes (manual clear)
• Computer crash: < 5 minutes (reboot + reopen)
• Firebase outage: N/A (wait for service)
```

---

## 📚 API Reference (Internal)

```
┌─────────────────────────────────────────────────────────────┐
│                   FIREBASE API USAGE                         │
└─────────────────────────────────────────────────────────────┘

Firestore Operations
────────────────────

READ: Query print history
  const q = query(
    collection(db, "printQueue"),
    where("userId", "==", uid),
    where("status", "==", "completed")
  );
  const snapshot = await getDocs(q);

WRITE: Add print job
  await addDoc(collection(db, "printQueue"), {
    userId, userName, teamName, photoUrl,
    status: "pending",
    createdAt: serverTimestamp()
  });

UPDATE: Change print status
  await updateDoc(doc(db, "printQueue", jobId), {
    status: "completed",
    printedAt: serverTimestamp()
  });

LISTEN: Real-time print queue
  const q = query(
    collection(db, "printQueue"),
    where("status", "==", "pending")
  );
  onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        handlePrint(change.doc.data());
      }
    });
  });

Storage Operations
──────────────────

UPLOAD: Photo to storage
  const storageRef = ref(storage, `photobooth/${uid}/${timestamp}.jpg`);
  await uploadBytes(storageRef, blob);

DOWNLOAD: Get photo URL
  const url = await getDownloadURL(storageRef);

LIST: All photos for user
  const folderRef = ref(storage, `photobooth/${uid}`);
  const result = await listAll(folderRef);
  const urls = await Promise.all(
    result.items.map(item => getDownloadURL(item))
  );
```

---

**Architecture Version**: 1.0  
**Last Updated**: Pre-Deployment  
**Document Status**: Complete  
**Review Status**: Ready for Technical Review
