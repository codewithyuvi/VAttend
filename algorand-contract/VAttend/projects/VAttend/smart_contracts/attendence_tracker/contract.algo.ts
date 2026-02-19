import {
  Contract,
  GlobalState,
  LocalState,
  Txn,
  assert,
  Account,
  uint64,
  bytes,
} from '@algorandfoundation/algorand-typescript'

export class AttendenceTracker extends Contract {

  // ---------- GLOBAL STATE ----------
  instructor = GlobalState<Account>({ key: 'instructor' })
  startTime = GlobalState<uint64>({ key: 'start_time' })
  endTime = GlobalState<uint64>({ key: 'end_time' })
  attendanceCount = GlobalState<uint64>({ key: 'attendance_count' })
  eventActive = GlobalState<uint64>({ key: 'event_active' }) // 1 = open, 0 = closed

  // ---------- LOCAL STATE ----------
  attendanceHash = LocalState<bytes>({ key: 'attendance_hash' })
  checkinTimestamp = LocalState<uint64>({ key: 'timestamp' })

  // ---------- CREATE EVENT ----------
  create_event(start: uint64, end: uint64): void {

    if (!this.instructor.hasValue) {
      this.instructor.value = Txn.sender
    }

    assert(Txn.sender === this.instructor.value)

    this.startTime.value = start
    this.endTime.value = end

    this.attendanceCount.value = 0
    this.eventActive.value = 1
  }

  // ---------- CLOSE EVENT ----------
  close_event(): void {
    assert(Txn.sender === this.instructor.value)
    this.eventActive.value = 0
  }

  // ---------- CHECK IN ----------
  check_in(hash: bytes): void {

    // event must be active
    assert(this.eventActive.value === 1)

    assert(Txn.firstValid >= this.startTime.value)
    assert(Txn.firstValid <= this.endTime.value)

    assert(!this.attendanceHash(Txn.sender).hasValue)

    this.attendanceHash(Txn.sender).value = hash
    this.checkinTimestamp(Txn.sender).value = Txn.firstValid

    this.attendanceCount.value = this.attendanceCount.value + 1
  }
}
