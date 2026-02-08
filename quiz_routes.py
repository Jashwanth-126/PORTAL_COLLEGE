from flask import Blueprint, Flask, render_template, request, redirect, url_for, session, flash, Response, send_from_directory, jsonify
from supabase import create_client, Client
import os
from dotenv import load_dotenv
import csv
from io import BytesIO
from datetime import date, datetime, timedelta
import datetime as dt # Import the module as 'dt' to avoid conflicts
from reportlab.lib.pagesizes import letter
from io import StringIO, BytesIO
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from flask_mail import Mail, Message
import random
from datetime import datetime
from flask import jsonify # Needed for the new API route
from werkzeug.utils import secure_filename
import uuid
from flask_cors import CORS  # Enable CORS for React frontend
import threading 
import datetime as dt 
from datetime import date, timedelta
from flask import Blueprint, request, jsonify, session
import datetime as dt
from supabase_client import supabase   # ✅ THIS LINE

# Blueprint
app_bp = Blueprint("quiz", __name__)

# ============== QUIZ / ASSESSMENT ROUTES ==============

# Admin: Create Quiz
@app_bp.route("/api/quiz/create", methods=["POST"])
def create_quiz():
    if "admin" not in session:
        return jsonify({"error": "Unauthorized"}), 401
    
    data = request.get_json()
    
    try:
        # Create quiz record
        quiz_data = {
            "title": data.get("title"),
            "section_id": data.get("section_id"),
            "duration": data.get("duration"),
            "start_time": data.get("start_time"),
            "end_time": data.get("end_time"),
            "created_by": session["admin"],
            "created_at": dt.datetime.now().isoformat()
        }
        
        quiz_res = supabase.table("quizzes").insert(quiz_data).execute()
        quiz_id = quiz_res.data[0]["id"]
        
        # Insert questions
        for q in data.get("questions", []):
            question_data = {
                "quiz_id": quiz_id,
                "question_text": q.get("question_text"),
                "option_a": q.get("option_a"),
                "option_b": q.get("option_b"),
                "option_c": q.get("option_c"),
                "option_d": q.get("option_d"),
                "correct_option": q.get("correct_option"),
                "marks": 1
            }
            supabase.table("quiz_questions").insert(question_data).execute()
        
        return jsonify({"success": True, "quiz_id": quiz_id, "message": "Quiz created successfully"})
    
    except Exception as e:
        return jsonify({"success": False, "message": f"Error creating quiz: {str(e)}"}), 500


# Admin: Get all quizzes
@app_bp.route("/api/quiz/list", methods=["GET"])
def get_quizzes():
    if "admin" not in session:
        return jsonify({"error": "Unauthorized"}), 401
    
    try:
        quizzes = supabase.table("quizzes").select(
            "*, sections(name)"
        ).order("created_at", desc=True).execute().data
        
        # Add question count to each quiz
        for quiz in quizzes:
            questions = supabase.table("quiz_questions").select(
                "id", count="exact"
            ).eq("quiz_id", quiz["id"]).execute()
            quiz["question_count"] = len(questions.data) if questions.data else 0
            quiz["section_name"] = quiz.get("sections", {}).get("name", "Unknown")
            
            # Calculate total marks
            quiz["total_marks"] = quiz["question_count"]  # 1 mark per question
        
        return jsonify({"quizzes": quizzes})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Admin: Get single quiz details
@app_bp.route("/api/quiz/<int:quiz_id>", methods=["GET"])
def get_quiz(quiz_id):
    if "admin" not in session:
        return jsonify({"error": "Unauthorized"}), 401
    
    try:
        quiz = supabase.table("quizzes").select(
            "*, sections(name)"
        ).eq("id", quiz_id).single().execute().data
        
        questions = supabase.table("quiz_questions").select("*").eq("quiz_id", quiz_id).execute().data
        
        quiz["section_name"] = quiz.get("sections", {}).get("name", "Unknown")
        quiz["total_marks"] = len(questions)
        
        return jsonify({"quiz": quiz, "questions": questions})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Admin: Delete quiz
@app_bp.route("/api/quiz/<int:quiz_id>", methods=["DELETE"])
def delete_quiz(quiz_id):
    if "admin" not in session:
        return jsonify({"error": "Unauthorized"}), 401
    
    try:
        # Delete attempts and answers first
        supabase.table("quiz_answers").delete().eq("quiz_id", quiz_id).execute()
        supabase.table("quiz_attempts").delete().eq("quiz_id", quiz_id).execute()
        
        # Delete questions
        supabase.table("quiz_questions").delete().eq("quiz_id", quiz_id).execute()
        
        # Delete quiz
        supabase.table("quizzes").delete().eq("id", quiz_id).execute()
        
        return jsonify({"success": True, "message": "Quiz deleted successfully"})
    
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500



@app_bp.route("/api/quiz/<int:quiz_id>/results", methods=["GET"])
def get_quiz_results(quiz_id):
    if "admin" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    try:
        # 1️⃣ Get total marks (1 mark per question)
        total_marks = supabase.table("quiz_questions") \
            .select("id", count="exact") \
            .eq("quiz_id", quiz_id) \
            .execute() \
            .count

        # 2️⃣ Get all attempts for this quiz
        attempts = supabase.table("quiz_attempts") \
            .select(
                "id, student_id, status, submitted_at, students(username)"
            ) \
            .eq("quiz_id", quiz_id) \
            .execute() \
            .data

        # 3️⃣ Keep latest attempt per student
        latest_attempt = {}
        for att in attempts:
            sid = att["student_id"]
            if sid not in latest_attempt:
                latest_attempt[sid] = att

        results = []

        # 4️⃣ Calculate marks per student
        for att in latest_attempt.values():
            marks = 0
            status = "Not Submitted"
            submitted_at = None

            if att["status"] == "completed":
                answers = supabase.table("quiz_answers") \
                    .select("is_correct") \
                    .eq("attempt_id", att["id"]) \
                    .execute() \
                    .data

                # ✅ Correct marks calculation
                marks = sum(1 for a in answers if a["is_correct"])
                status = "Submitted"
                submitted_at = att["submitted_at"]

            results.append({
                "student_name": att["students"]["username"],
                "marks_obtained": marks,
                "total_marks": total_marks,
                "status": status,
                "submitted_at": submitted_at
            })

        return jsonify({
            "results": results
        }), 200

    except Exception as e:
        print("FACULTY RESULT ERROR:", e)
        return jsonify({"error": "Failed to load quiz results"}), 500





from datetime import datetime, timezone

@app_bp.route("/api/quiz/<int:quiz_id>/attempt", methods=["GET"])
def get_quiz_for_attempt(quiz_id):
    if "user" not in session or "student_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    student_id = session["student_id"]

    try:
        # 🔒 Check if student already attempted this quiz
        existing_attempt = supabase.table("quiz_attempts") \
            .select("status") \
            .eq("quiz_id", quiz_id) \
            .eq("student_id", student_id) \
            .execute() \
            .data

        if existing_attempt and existing_attempt[0]["status"] == "completed":
            return jsonify({
                "locked": True,
                "message": "You have already submitted this quiz"
            }), 403

        # ✅ Load quiz
        quiz = supabase.table("quizzes") \
            .select("*") \
            .eq("id", quiz_id) \
            .single() \
            .execute() \
            .data

        if not quiz:
            return jsonify({"error": "Quiz not found"}), 404

        # ✅ Load questions
        questions = supabase.table("quiz_questions") \
            .select("*") \
            .eq("quiz_id", quiz_id) \
            .execute() \
            .data

        now = datetime.now(timezone.utc)

        start_time = datetime.fromisoformat(quiz["start_time"]).astimezone(timezone.utc)
        end_time = datetime.fromisoformat(quiz["end_time"]).astimezone(timezone.utc)

        if now < start_time:
            return jsonify({"error": "Quiz not started"}), 403

        if now > end_time:
            return jsonify({"error": "Quiz ended"}), 403

        remaining_seconds = int((end_time - now).total_seconds())

        # ✅ ALWAYS return response
        return jsonify({
            "quiz": quiz,
            "questions": questions,
            "remaining_seconds": remaining_seconds
        }), 200

    except Exception as e:
        print("GET QUIZ ATTEMPT ERROR:", e)
        return jsonify({"error": "Unable to load quiz"}), 500






from datetime import datetime, timezone
from flask import request, jsonify, session

@app_bp.route("/api/quiz/<int:quiz_id>/submit", methods=["POST"])
def submit_quiz_answers(quiz_id):
    if "user" not in session or "student_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Invalid JSON"}), 400

    attempt_id = data.get("attempt_id")
    answers = data.get("answers", {})

    if not attempt_id:
        return jsonify({"error": "Attempt ID missing"}), 400

    try:
        # 1️⃣ Ensure attempt exists & not already submitted
        attempt_res = supabase.table("quiz_attempts") \
            .select("status") \
            .eq("id", attempt_id) \
            .execute()

        if not attempt_res.data:
            return jsonify({"error": "Attempt not found"}), 404

        if attempt_res.data[0]["status"] == "completed":
            return jsonify({"success": True}), 200  # idempotent

        # 2️⃣ Get questions
        questions = supabase.table("quiz_questions") \
            .select("id, correct_option") \
            .eq("quiz_id", quiz_id) \
            .execute() \
            .data

        qmap = {q["id"]: q for q in questions}

        # 3️⃣ Save answers
        for qid_str, selected in answers.items():
            if selected is None:
                continue

            qid = int(qid_str)
            question = qmap.get(qid)
            if not question:
                continue

            is_correct = selected == question["correct_option"]

            supabase.table("quiz_answers").insert({
                "attempt_id": attempt_id,
                "quiz_id": quiz_id,
                "question_id": qid,
                "selected_option": selected,
                "is_correct": is_correct
            }).execute()

        # 4️⃣ Mark attempt completed
        supabase.table("quiz_attempts").update({
            "status": "completed",
            "submitted_at": datetime.utcnow().isoformat()
        }).eq("id", attempt_id).execute()

        return jsonify({"success": True}), 200

    except Exception as e:
        print("SUBMIT ERROR:", e)
        return jsonify({"error": "Submission failed"}), 500

@app_bp.route("/api/quiz/<int:quiz_id>/my-results", methods=["GET"])
def get_my_quiz_results(quiz_id):
    if "user" not in session or "student_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    try:
        student_id = session["student_id"]

        # 1️⃣ Total marks = total questions (ALWAYS)
        total_marks = supabase.table("quiz_questions") \
            .select("id", count="exact") \
            .eq("quiz_id", quiz_id) \
            .execute() \
            .count

        # 2️⃣ Get latest completed attempt (if any)
        attempts = supabase.table("quiz_attempts") \
            .select("id, status") \
            .eq("quiz_id", quiz_id) \
            .eq("student_id", student_id) \
            .order("submitted_at", desc=True) \
            .execute() \
            .data

        # ❌ No attempt at all
        if not attempts:
            return jsonify({
                "marks_obtained": 0,
                "total_marks": total_marks,   # ✅ FIX HERE
                "status": "Not Attempted"
            }), 200

        attempt = attempts[0]

        # ⏳ Attempt exists but not submitted
        if attempt["status"] != "completed":
            return jsonify({
                "marks_obtained": 0,
                "total_marks": total_marks,   # ✅ FIX HERE
                "status": "Not Submitted"
            }), 200

        # ✅ Submitted attempt → calculate marks
        answers = supabase.table("quiz_answers") \
            .select("is_correct") \
            .eq("attempt_id", attempt["id"]) \
            .execute() \
            .data

        marks = sum(1 for a in answers if a["is_correct"])

        return jsonify({
            "marks_obtained": marks,
            "total_marks": total_marks,   # ✅ ALWAYS correct
            "status": "Submitted"
        }), 200

    except Exception as e:
        print("MY RESULTS ERROR:", e)
        return jsonify({"error": "Failed to load results"}), 500


# Get available quizzes for the student's section
@app_bp.route("/api/student/quizzes", methods=["GET"])
def get_student_quizzes():
    if "user" not in session or "section_id" not in session:
        return jsonify({"error": "Unauthorized or No Section Assigned"}), 401 [cite: 155]
    
    try:
        section_id = session["section_id"]
        # Fetch quizzes only for this section [cite: 156]
        quizzes = supabase.table("quizzes").select("*").eq("section_id", section_id).order("start_time", desc=True).execute().data
        
        for quiz in quizzes:
            # Count questions for each quiz [cite: 157]
            questions = supabase.table("quiz_questions").select("id", count="exact").eq("quiz_id", quiz["id"]).execute()
            quiz["question_count"] = len(questions.data) if questions.data else 0
            
            # Check if student already attempted this [cite: 151]
            attempt = supabase.table("quiz_attempts").select("status") \
                .eq("quiz_id", quiz["id"]).eq("student_id", session["student_id"]).execute().data
            quiz["attempt_status"] = attempt[0]["status"] if attempt else "not_started"
        
        return jsonify({"quizzes": quizzes})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Start a quiz attempt
@app_bp.route("/api/quiz/<int:quiz_id>/start-attempt", methods=["POST"])
def start_quiz_attempt(quiz_id):
    if "user" not in session or "student_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    student_id = session["student_id"]

    try:
        # 🔒 Check if student already attempted this quiz
        existing_attempt = supabase.table("quiz_attempts") \
            .select("id, status") \
            .eq("quiz_id", quiz_id) \
            .eq("student_id", student_id) \
            .execute() \
            .data

        if existing_attempt:
            return jsonify({
                "error": " ",
                "status": existing_attempt[0]["status"]
            }), 403

        # ✅ Allow only FIRST attempt
        attempt_data = {
            "quiz_id": quiz_id,
            "student_id": student_id,
            "started_at": datetime.utcnow().isoformat(),
            "status": "in_progress"
        }

        attempt = supabase.table("quiz_attempts") \
            .insert(attempt_data) \
            .execute() \
            .data[0]

        return jsonify({
            "success": True,
            "attempt_id": attempt["id"]
        }), 200

    except Exception as e:
        print("START ATTEMPT ERROR:", e)
        return jsonify({"error": "Failed to start quiz"}), 500


@app_bp.route("/api/sections", methods=["GET"])
def get_sections():
    if "admin" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    try:
        sections = supabase.table("sections") \
            .select("id, name") \
            .order("name") \
            .execute() \
            .data

        return jsonify({
            "sections": sections
        }), 200

    except Exception as e:
        print("SECTIONS ERROR:", e)
        return jsonify({"error": "Failed to load sections"}), 500
