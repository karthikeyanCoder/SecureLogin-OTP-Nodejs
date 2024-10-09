import express from "express"
const router = express.Router()
import {bookSession,getBookedDates,getBlockedDates} from "../Controllers/BookApoinment.js"
router.post("/book-session",bookSession)
router.get('/booked-dates', getBookedDates);
router.get("/blocked-dates",getBlockedDates)
export default router;
