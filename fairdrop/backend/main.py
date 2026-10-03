from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import redis
import uuid

app = FastAPI(
    title="FairDrop API",
    description="Backend for the FairDrop flash-sale prototype",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

redis_client = redis.Redis(
    host="localhost",
    port=6379,
    decode_responses=True
)

QUEUE_KEY = "fairdrop:queue"


# =========================================================
# HOME
# =========================================================

@app.get("/")
def home():
    return {
        "message": "FairDrop backend is running!"
    }


# =========================================================
# QUEUE
# =========================================================

@app.post("/queue/join")
def join_queue():

    user_id = f"user_{uuid.uuid4().hex[:8]}"

    redis_client.rpush(
        QUEUE_KEY,
        user_id
    )

    position = redis_client.lpos(
        QUEUE_KEY,
        user_id
    )

    return {
        "user_id": user_id,
        "position": position + 1,
        "queue_size": redis_client.llen(QUEUE_KEY)
    }


@app.get("/queue/status/{user_id}")
def queue_status(user_id: str):

    position = redis_client.lpos(
        QUEUE_KEY,
        user_id
    )

    # User is not in queue anymore
    if position is None:
        return {
            "status": "ready",
            "position": 0,
            "queue_size": redis_client.llen(QUEUE_KEY)
        }

    # User is first in queue
    if position == 0:

        redis_client.lpop(QUEUE_KEY)

        return {
            "status": "ready",
            "position": 0,
            "queue_size": redis_client.llen(QUEUE_KEY)
        }

    # Someone ahead of this user gets processed
    redis_client.lpop(QUEUE_KEY)

    # Check new position
    new_position = redis_client.lpos(
        QUEUE_KEY,
        user_id
    )

    if new_position is None:
        return {
            "status": "ready",
            "position": 0,
            "queue_size": redis_client.llen(QUEUE_KEY)
        }

    return {
        "status": "waiting",
        "position": new_position + 1,
        "queue_size": redis_client.llen(QUEUE_KEY)
    }


# =========================================================
# SEATS
# =========================================================

@app.get("/seats")
def get_seats():

    seats = []

    for row in "ABCDEFGH":

        for number in range(1, 13):

            seat_id = f"{row}{number}"
            key = f"fairdrop:seat:{seat_id}"

            if redis_client.exists(key):
                status = "reserved"
            else:
                status = "available"

            seats.append({
                "seat": seat_id,
                "status": status
            })

    return {
        "seats": seats
    }


# =========================================================
# RESERVE SEAT
# =========================================================

@app.post("/seats/reserve/{seat_id}")
def reserve_seat(seat_id: str):

    seat_id = seat_id.upper()

    if len(seat_id) < 2 or seat_id[0] not in "ABCDEFGH":
        return {
            "success": False,
            "message": "Invalid seat"
        }

    try:
        seat_number = int(seat_id[1:])
    except ValueError:
        return {
            "success": False,
            "message": "Invalid seat"
        }

    if seat_number < 1 or seat_number > 12:
        return {
            "success": False,
            "message": "Invalid seat"
        }

    key = f"fairdrop:seat:{seat_id}"

    reservation_id = f"res_{uuid.uuid4().hex[:10]}"

    reserved = redis_client.set(
        key,
        reservation_id,
        nx=True,
        ex=300
    )

    if not reserved:
        return {
            "success": False,
            "message": "Seat is already reserved"
        }

    return {
        "success": True,
        "seat": seat_id,
        "reservation_id": reservation_id,
        "message": "Seat reserved for 5 minutes"
    }


# =========================================================
# VERIFY RESERVATION
# =========================================================

@app.get("/reservations/verify/{reservation_id}")
def verify_reservation(reservation_id: str):

    for row in "ABCDEFGH":

        for number in range(1, 13):

            seat_id = f"{row}{number}"
            key = f"fairdrop:seat:{seat_id}"

            stored_reservation = redis_client.get(key)

            if stored_reservation == reservation_id:
                return {
                    "valid": True,
                    "seat": seat_id,
                    "reservation_id": reservation_id,
                    "message": "Reservation is valid"
                }

    return {
        "valid": False,
        "message": "Reservation expired or does not exist"
    }


# =========================================================
# CREATE BOOKING
# =========================================================

@app.post("/bookings")
def create_booking(
    seat_id: str,
    reservation_id: str
):

    seat_id = seat_id.upper()

    seat_key = f"fairdrop:seat:{seat_id}"

    stored_reservation = redis_client.get(seat_key)

    # Reservation expired
    if stored_reservation is None:
        return {
            "success": False,
            "message": "Seat reservation has expired"
        }

    # Invalid reservation
    if stored_reservation != reservation_id:
        return {
            "success": False,
            "message": "Invalid reservation"
        }

    booking_id = f"FD-{uuid.uuid4().hex[:8].upper()}"

    booking = {
        "booking_id": booking_id,
        "seat": seat_id,
        "reservation_id": reservation_id,
        "event": "Night Shift / 001",
        "ticket_type": "Premium",
        "price": 1999,
        "fee": 99,
        "total": 2098,
        "status": "confirmed"
    }

    booking_key = f"fairdrop:booking:{booking_id}"

    redis_client.hset(
        booking_key,
        mapping=booking
    )

    # Keep booking for 24 hours
    redis_client.expire(
        booking_key,
        86400
    )

    # Remove temporary seat reservation
    redis_client.delete(seat_key)

    return {
        "success": True,
        "booking": booking
    }