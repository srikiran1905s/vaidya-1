from datetime import datetime, timedelta, timezone
import os

from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS


def create_app() -> Flask:
    app = Flask(__name__)

    app.config['JSON_SORT_KEYS'] = False

    frontend_url = os.environ.get('FRONTEND_URL', 'http://localhost:8080')
    CORS(app, resources={r"/api/*": {"origins": [frontend_url, "http://localhost:8080", "http://127.0.0.1:8080"]}}, supports_credentials=True)

    # Serve static frontend (html-frontend) from Flask for same-origin setup
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    frontend_dir = os.path.join(project_root, 'html-frontend')

    @app.get('/')
    def serve_index():
        return send_from_directory(frontend_dir, 'index.html')

    @app.get('/<path:path>')
    def serve_static(path: str):
        # Don't serve static files for API routes
        if path.startswith('api/'):
            return jsonify({'error': 'Not found'}), 404
        try:
            return send_from_directory(frontend_dir, path)
        except Exception:
            # Fallback to index for simple client-side routing or missing files
            return send_from_directory(frontend_dir, 'index.html')

    # Health check
    @app.get('/api/health')
    def health() -> tuple:
        return jsonify({
            'status': 'OK',
            'message': 'Vaidya API is running (Flask)',
            'database': 'Connected' if use_db else 'Disconnected'
        })

    # API info
    @app.get('/api')
    def api_info() -> tuple:
        return jsonify({
            'message': 'Vaidya Telemedicine API (Flask)',
            'version': '1.0.0',
            'endpoints': {
                'health': '/api/health',
                'auth': '/api/auth',
                'patient': '/api/patient',
                'doctor': '/api/doctor'
            }
        })

    # In-memory stores for demo compatibility
    users = {
        # role -> email -> user dict
        'patient': {},
        'doctor': {}
    }
    appointments = []
    vitals = []
    health_records = []
    prescriptions = []

    # Optional MongoDB connection (fallback to in-memory if unavailable)
    use_db = False
    db = None
    try:
        from pymongo import MongoClient
        mongo_uri = os.environ.get('MONGODB_URI', 'mongodb://localhost:27017/vaidya')
        client = MongoClient(mongo_uri, serverSelectionTimeoutMS=2000)
        client.admin.command('ping')
        database_name = (mongo_uri.rsplit('/', 1)[-1] or 'vaidya').split('?')[0]
        db = client.get_database(database_name if database_name else 'vaidya')
        use_db = True
    except Exception:
        use_db = False

    # Time helpers
    def now_utc() -> datetime:
        return datetime.now(timezone.utc)

    def iso_utc(dt: datetime | None = None) -> str:
        t = dt or now_utc()
        return t.isoformat().replace('+00:00', 'Z')

    # Seed demo data (mirrors legacy Node seed baseline)
    def seed_demo_data():
        from werkzeug.security import generate_password_hash as gph
        if users['patient'] or users['doctor']:
            return
        # Patients
        patient_creds = [
            ('John Smith', 'john@example.com', 45, '+1-555-0101'),
            ('Emma Wilson', 'emma@example.com', 32, '+1-555-0201'),
            ('Michael Brown', 'michael@example.com', 58, '+1-555-0301'),
        ]
        for idx, (name, email, age, phone) in enumerate(patient_creds, start=1):
            users['patient'][email] = {
                '_id': f'patient_{idx}',
                'name': name,
                'email': email,
                'password': gph('password123'),
                'age': age,
                'phone': phone,
            }
        # Doctors
        doctor_creds = [
            ('Dr. Sarah Johnson', 'sarah.johnson@hospital.com', 'Cardiology'),
            ('Dr. David Chen', 'david.chen@hospital.com', 'General Physician'),
            ('Dr. Priya Patel', 'priya.patel@hospital.com', 'Endocrinology'),
        ]
        for idx, (name, email, specialty) in enumerate(doctor_creds, start=1):
            users['doctor'][email] = {
                '_id': f'doctor_{idx}',
                'name': name,
                'email': email,
                'password': gph('password123'),
                'specialty': specialty,
            }

        # Appointments (scheduled + completed)
        def iso(d: datetime):
            return iso_utc(d)
        today = now_utc()
        tomorrow = today + timedelta(days=1)
        next_week = today + timedelta(days=7)
        # helpers
        p1 = users['patient']['john@example.com']['_id']
        p2 = users['patient']['emma@example.com']['_id']
        p3 = users['patient']['michael@example.com']['_id']
        d1 = users['doctor']['sarah.johnson@hospital.com']['_id']
        d2 = users['doctor']['david.chen@hospital.com']['_id']
        d3 = users['doctor']['priya.patel@hospital.com']['_id']
        # Scheduled
        appointments.extend([
            {
                'id': 'apt_1', 'patientId': p1, 'doctorId': d1, 'patientName': 'John Smith',
                'doctorName': 'Dr. Sarah Johnson', 'specialty': 'Cardiology',
                'date': iso(today), 'time': '3:00 PM', 'type': 'Video Consultation',
                'status': 'scheduled', 'priority': 'normal',
                'symptoms': ['Chest pain', 'Shortness of breath'], 'notes': 'Follow-up for hypertension',
                'meetingLink': 'https://meet.vaidya.com/room123', 'duration': 30
            },
            {
                'id': 'apt_2', 'patientId': p2, 'doctorId': d2, 'patientName': 'Emma Wilson',
                'doctorName': 'Dr. David Chen', 'specialty': 'General Physician',
                'date': iso(tomorrow), 'time': '10:00 AM', 'type': 'Initial',
                'status': 'scheduled', 'priority': 'high',
                'symptoms': ['Persistent cough', 'Wheezing'], 'notes': 'New patient consultation',
                'meetingLink': 'https://meet.vaidya.com/room124', 'duration': 45
            },
            {
                'id': 'apt_3', 'patientId': p3, 'doctorId': d3, 'patientName': 'Michael Brown',
                'doctorName': 'Dr. Priya Patel', 'specialty': 'Endocrinology',
                'date': iso(next_week), 'time': '2:00 PM', 'type': 'Follow-up',
                'status': 'scheduled', 'priority': 'normal',
                'symptoms': ['Blood sugar monitoring'], 'notes': 'Routine diabetes checkup',
                'meetingLink': 'https://meet.vaidya.com/room125', 'duration': 30
            },
        ])
        # Completed
        appointments.extend([
            {
                'id': 'apt_4', 'patientId': p1, 'doctorId': d1, 'patientName': 'John Smith',
                'doctorName': 'Dr. Sarah Johnson', 'specialty': 'Cardiology',
                'date': '2025-01-15T11:00:00Z', 'time': '11:00 AM', 'type': 'Video Consultation',
                'status': 'completed', 'priority': 'normal', 'symptoms': ['Regular checkup'],
                'notes': 'Annual cardiac evaluation completed', 'duration': 30
            },
            {
                'id': 'apt_5', 'patientId': p2, 'doctorId': d2, 'patientName': 'Emma Wilson',
                'doctorName': 'Dr. David Chen', 'specialty': 'General Physician',
                'date': '2025-01-10T15:30:00Z', 'time': '3:30 PM', 'type': 'Video Consultation',
                'status': 'completed', 'priority': 'normal', 'symptoms': ['Asthma symptoms'],
                'notes': 'Prescribed inhaler adjustment', 'duration': 30
            },
        ])

        # Vitals (latest 4 used by UI)
        vitals.extend([
            {'id': 'v_1', 'patientId': p1, 'label': 'Heart Rate', 'value': '72 bpm', 'status': 'normal', 'unit': 'bpm', 'createdAt': iso(today)},
            {'id': 'v_2', 'patientId': p1, 'label': 'Blood Pressure', 'value': '120/80', 'status': 'normal', 'unit': 'mmHg', 'createdAt': iso(today)},
            {'id': 'v_3', 'patientId': p1, 'label': 'Temperature', 'value': '98.6°F', 'status': 'normal', 'unit': '°F', 'createdAt': iso(today)},
            {'id': 'v_4', 'patientId': p1, 'label': 'Oxygen', 'value': '98%', 'status': 'normal', 'unit': '%', 'createdAt': iso(today)},
            {'id': 'v_5', 'patientId': p2, 'label': 'Heart Rate', 'value': '78 bpm', 'status': 'normal', 'unit': 'bpm', 'createdAt': iso(today)},
        ])

        # Health Records
        health_records.extend([
            {
                'id': 'rec_1', 'patientId': p1, 'doctorId': d1, 'title': 'Cardiac Stress Test Results',
                'type': 'Lab Results', 'doctor': 'Dr. Sarah Johnson', 'date': '2025-01-15',
                'description': 'Normal cardiac stress test. No significant abnormalities detected.',
                'fileUrl': 'https://storage.vaidya.com/records/cardiac-test-001.pdf'
            },
            {
                'id': 'rec_2', 'patientId': p1, 'doctorId': d1, 'title': 'Blood Pressure Medication',
                'type': 'Prescription', 'doctor': 'Dr. Sarah Johnson', 'date': '2025-01-10',
                'description': 'Lisinopril 10mg - Once daily for hypertension',
                'fileUrl': 'https://storage.vaidya.com/records/prescription-001.pdf'
            },
            {
                'id': 'rec_3', 'patientId': p2, 'doctorId': d2, 'title': 'Pulmonary Function Test',
                'type': 'Lab Results', 'doctor': 'Dr. David Chen', 'date': '2025-01-12',
                'description': 'Asthma well controlled. FEV1 within normal range.',
                'fileUrl': 'https://storage.vaidya.com/records/pulmonary-test-001.pdf'
            },
        ])

        # Prescriptions
        prescriptions.extend([
            {
                'id': 'pr_1', 'patientId': p1, 'patientName': 'John Smith', 'doctorId': d1,
                'medications': [
                    {'name': 'Lisinopril', 'dosage': '10mg', 'frequency': 'Once daily', 'duration': '90 days', 'instructions': 'Take in the morning with water'},
                    {'name': 'Aspirin', 'dosage': '81mg', 'frequency': 'Once daily', 'duration': '90 days', 'instructions': 'Take with food'},
                ],
                'diagnosis': 'Hypertension, Cardiovascular risk prevention',
                'notes': 'Monitor blood pressure weekly. Follow up in 3 months.',
                'date': '2025-01-15', 'validUntil': '2025-04-15', 'status': 'active'
            },
            {
                'id': 'pr_2', 'patientId': p2, 'patientName': 'Emma Wilson', 'doctorId': d2,
                'medications': [
                    {'name': 'Albuterol Inhaler', 'dosage': '90mcg', 'frequency': 'As needed', 'duration': '30 days'},
                    {'name': 'Fluticasone Inhaler', 'dosage': '110mcg', 'frequency': 'Twice daily', 'duration': '30 days'},
                ],
                'diagnosis': 'Asthma - Moderate persistent',
                'notes': 'Use rescue inhaler as needed. Daily controller medication important.',
                'date': '2025-01-10', 'validUntil': '2025-02-10', 'status': 'active'
            },
        ])

    seed_demo_data()

    import jwt
    from werkzeug.security import generate_password_hash, check_password_hash

    JWT_SECRET = os.environ.get('JWT_SECRET', 'dev-secret')

    def generate_token(user_id: str, role: str) -> str:
        payload = {
            'userId': user_id,
            'role': role,
            'exp': now_utc() + timedelta(days=7)
        }
        return jwt.encode(payload, JWT_SECRET, algorithm='HS256')

    def auth_required(fn):
        from functools import wraps

        @wraps(fn)
        def wrapper(*args, **kwargs):
            auth_header = request.headers.get('Authorization', '')
            token = auth_header.replace('Bearer ', '') if auth_header.startswith('Bearer ') else None
            if not token:
                return jsonify({'error': 'Unauthorized'}), 401
            try:
                payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
            except Exception:
                return jsonify({'error': 'Unauthorized'}), 401
            request.user = {'userId': payload.get('userId'), 'role': payload.get('role')}
            return fn(*args, **kwargs)

        return wrapper

    # Auth routes
    @app.post('/api/auth/signup')
    def signup():
        body = request.get_json(force=True, silent=True) or {}
        email = (body.get('email') or '').strip().lower()
        password = body.get('password') or ''
        name = (body.get('name') or '').strip()
        role = body.get('role')
        if role not in ('patient', 'doctor'):
            return jsonify({'error': 'Invalid role'}), 400
        if not email or '@' not in email:
            return jsonify({'error': 'Invalid email'}), 400
        if not password or len(password) < 6:
            return jsonify({'error': 'Password too short'}), 400
        if not name:
            return jsonify({'error': 'Name required'}), 400

        if use_db:
            collection = db['patients'] if role == 'patient' else db['doctors']
            existing = collection.find_one({'email': email})
            if existing:
                return jsonify({'error': 'User already exists with this email'}), 400
            doc = {
                'name': name,
                'email': email,
                'password': generate_password_hash(password)
            }
            if role == 'patient':
                doc['age'] = body.get('age', 25)
                doc['phone'] = body.get('phone', '0000000000')
            else:
                doc['specialty'] = body.get('specialty', 'General Physician')
                doc['license'] = body.get('license', f'LIC{int(now_utc().timestamp())}')
            result = collection.insert_one(doc)
            user_id = str(result.inserted_id)
        else:
            if email in users[role]:
                return jsonify({'error': 'User already exists with this email'}), 400
            user_id = f"{role}_{len(users[role])+1}"
            users[role][email] = {
                '_id': user_id,
                'name': name,
                'email': email,
                'password': generate_password_hash(password)
            }

        token = generate_token(user_id, role)
        return jsonify({
            'message': 'Account created successfully',
            'token': token,
            'userId': user_id,
            'role': role,
            'name': name
        }), 201

    @app.post('/api/auth/signin')
    def signin():
        body = request.get_json(force=True, silent=True) or {}
        email = (body.get('email') or '').strip().lower()
        password = body.get('password') or ''
        role = body.get('role')
        if role not in ('patient', 'doctor'):
            return jsonify({'error': 'Invalid role'}), 400
        if use_db:
            collection = db['patients'] if role == 'patient' else db['doctors']
            user = collection.find_one({'email': email})
            if not user or not check_password_hash(user['password'], password):
                return jsonify({'error': 'Invalid credentials'}), 401
            user_id = str(user.get('_id'))
            name = user.get('name')
        else:
            user = users[role].get(email)
            if not user or not check_password_hash(user['password'], password):
                return jsonify({'error': 'Invalid credentials'}), 401
            user_id = user['_id']
            name = user['name']

        token = generate_token(user_id, role)
        return jsonify({
            'message': 'Sign in successful',
            'token': token,
            'userId': user_id,
            'role': role,
            'name': name
        })

    # Patient routes
    @app.get('/api/patient/profile')
    @auth_required
    def patient_profile():
        user_id = request.user['userId']
        if use_db:
            try:
                from bson import ObjectId
                patient = db['patients'].find_one({'_id': ObjectId(user_id)})
            except Exception:
                patient = None
            if not patient:
                return jsonify({'error': 'Patient not found'}), 404
            safe = {k: v for k, v in patient.items() if k != 'password'}
            safe['_id'] = str(patient.get('_id'))
        else:
            patient = next((u for u in users['patient'].values() if u['_id'] == user_id), None)
            if not patient:
                return jsonify({'error': 'Patient not found'}), 404
            safe = {k: v for k, v in patient.items() if k != 'password'}
        # Minimal fields expected by UI
        safe.setdefault('age', 25)
        safe.setdefault('phone', '0000000000')
        return jsonify(safe)

    @app.get('/api/patient/vitals/latest')
    @auth_required
    def patient_vitals_latest():
        user_id = request.user['userId']
        if use_db:
            vs = list(db['vitals'].find({'patientId': user_id}).sort('createdAt', -1).limit(4))
            for v in vs:
                v['id'] = str(v.get('_id'))
                v.pop('_id', None)
            return jsonify(vs)
        else:
            vs = [v for v in vitals if v['patientId'] == user_id]
            vs.sort(key=lambda x: x['createdAt'], reverse=True)
            return jsonify(vs[:4])

    @app.post('/api/patient/vitals')
    @auth_required
    def patient_add_vitals():
        body = request.get_json(force=True, silent=True) or {}
        if use_db:
            doc = {
                'patientId': request.user['userId'],
                'createdAt': iso_utc()
            }
            doc.update(body)
            result = db['vitals'].insert_one(doc)
            doc['id'] = str(result.inserted_id)
            return jsonify(doc), 201
        else:
            entry = {
                'id': f"v_{len(vitals)+1}",
                'patientId': request.user['userId'],
                'createdAt': iso_utc()
            }
            entry.update(body)
            vitals.append(entry)
            return jsonify(entry), 201

    @app.get('/api/patient/appointments/upcoming')
    @auth_required
    def patient_upcoming_appointment():
        user_id = request.user['userId']
        if use_db:
            cur = db['appointments'].find({'patientId': user_id, 'status': 'scheduled', 'date': {'$exists': True}}).sort('date', 1).limit(1)
            arr = list(cur)
            if not arr:
                return jsonify(None)
            a = arr[0]
            return jsonify({
                'id': str(a.get('_id')),
                'doctor': a.get('doctorName', 'Unknown Doctor'),
                'specialty': a.get('specialty', ''),
                'date': a.get('date'),
                'time': a.get('time'),
                'type': a.get('type'),
                'meetingLink': a.get('meetingLink')
            })
        else:
            future = [a for a in appointments if a['patientId'] == user_id and a.get('status') == 'scheduled' and a.get('date')]
            future.sort(key=lambda x: x['date'])
            if not future:
                return jsonify(None)
            a = future[0]
            return jsonify({
                'id': a['id'],
                'doctor': a.get('doctorName', 'Unknown Doctor'),
                'specialty': a.get('specialty', ''),
                'date': a.get('date'),
                'time': a.get('time'),
                'type': a.get('type'),
                'meetingLink': a.get('meetingLink')
            })

    @app.get('/api/patient/appointments')
    @auth_required
    def patient_appointments():
        user_id = request.user['userId']
        if use_db:
            apts = list(db['appointments'].find({'patientId': user_id}).sort('date', -1))
            formatted = []
            for a in apts:
                apt_id = a.get('id') or str(a.get('_id'))
                formatted.append({
                    'id': apt_id,
                    'doctorName': a.get('doctorName', 'Unknown Doctor'),
                    'specialty': a.get('specialty', ''),
                    'date': a.get('date'),
                    'time': a.get('time'),
                    'status': a.get('status'),
                    'type': a.get('type')
                })
            return jsonify(formatted)
        else:
            apts = [a for a in appointments if a['patientId'] == user_id]
            apts.sort(key=lambda x: (x.get('date') or ''), reverse=True)
            formatted = [{
                'id': a['id'],
                'doctorName': a.get('doctorName', 'Unknown Doctor'),
                'specialty': a.get('specialty', ''),
                'date': a.get('date'),
                'time': a.get('time'),
                'status': a.get('status'),
                'type': a.get('type')
            } for a in apts]
            return jsonify(formatted)

    @app.post('/api/patient/appointments')
    @auth_required
    def patient_book_appointment():
        body = request.get_json(force=True, silent=True) or {}
        user_id = request.user['userId']
        
        # Get patient name from database/memory if not provided
        patient_name = body.get('patientName', 'Unknown Patient')
        if patient_name == 'Unknown Patient' or not patient_name:
            if use_db:
                try:
                    from bson import ObjectId
                    patient = db['patients'].find_one({'_id': ObjectId(user_id)})
                    if patient:
                        patient_name = patient.get('name', 'Unknown Patient')
                except Exception:
                    pass
            else:
                for email, patient in users['patient'].items():
                    if patient['_id'] == user_id:
                        patient_name = patient.get('name', 'Unknown Patient')
                        break
        
        if use_db:
            doc = {
                'patientId': user_id,
                'patientName': patient_name,
            }
            doc.update(body)
            doc.setdefault('status', 'scheduled')
            result = db['appointments'].insert_one(doc)
            doc['id'] = str(result.inserted_id)
            return jsonify(doc), 201
        else:
            new_apt = {
                'id': f"apt_{len(appointments)+1}",
                'patientId': user_id,
                'patientName': patient_name,
            }
            new_apt.update(body)
            new_apt.setdefault('status', 'scheduled')
            appointments.append(new_apt)
            return jsonify(new_apt), 201

    @app.get('/api/patient/records/recent')
    @auth_required
    def patient_recent_records():
        user_id = request.user['userId']
        if use_db:
            recs = list(db['health_records'].find({'patientId': user_id}).sort('date', -1).limit(5))
            for r in recs:
                r['id'] = str(r.get('_id'))
                r.pop('_id', None)
            return jsonify(recs)
        else:
            recs = [r for r in health_records if r['patientId'] == user_id]
            recs.sort(key=lambda x: x.get('date') or '', reverse=True)
            return jsonify(recs[:5])

    @app.get('/api/patient/records')
    @auth_required
    def patient_records():
        user_id = request.user['userId']
        if use_db:
            recs = list(db['health_records'].find({'patientId': user_id}).sort('date', -1))
            for r in recs:
                r['id'] = str(r.get('_id'))
                r.pop('_id', None)
            return jsonify(recs)
        else:
            recs = [r for r in health_records if r['patientId'] == user_id]
            recs.sort(key=lambda x: x.get('date') or '', reverse=True)
            return jsonify(recs)

    @app.post('/api/patient/records')
    @auth_required
    def patient_add_record():
        body = request.get_json(force=True, silent=True) or {}
        if use_db:
            doc = {
                'patientId': request.user['userId']
            }
            doc.update(body)
            result = db['health_records'].insert_one(doc)
            doc['id'] = str(result.inserted_id)
            return jsonify(doc), 201
        else:
            record = {
                'id': f"rec_{len(health_records)+1}",
                'patientId': request.user['userId']
            }
            record.update(body)
            health_records.append(record)
            return jsonify(record), 201

    @app.get('/api/patient/prescriptions')
    @auth_required
    def patient_prescriptions():
        user_id = request.user['userId']
        if use_db:
            presc = list(db['prescriptions'].find({'patientId': user_id}).sort('date', -1))
            for p in presc:
                p['id'] = str(p.get('_id'))
                p.pop('_id', None)
            return jsonify(presc)
        else:
            presc = [p for p in prescriptions if p.get('patientId') == user_id]
            presc.sort(key=lambda x: x.get('date') or '', reverse=True)
            return jsonify(presc)

    @app.get('/api/patient/consultations')
    @auth_required
    def patient_consultations():
        user_id = request.user['userId']
        if use_db:
            cons = list(db['appointments'].find({'patientId': user_id, 'status': 'completed'}).sort('date', -1))
            formatted = [{
                'id': str(a.get('_id')),
                'doctorName': a.get('doctorName', 'Unknown Doctor'),
                'specialty': a.get('specialty', ''),
                'date': a.get('date'),
                'time': a.get('time'),
                'status': a.get('status'),
                'duration': a.get('duration'),
                'notes': a.get('notes')
            } for a in cons]
            return jsonify(formatted)
        else:
            cons = [a for a in appointments if a['patientId'] == user_id and a.get('status') == 'completed']
            cons.sort(key=lambda x: x.get('date') or '', reverse=True)
            formatted = [{
                'id': a['id'],
                'doctorName': a.get('doctorName', 'Unknown Doctor'),
                'specialty': a.get('specialty', ''),
                'date': a.get('date'),
                'time': a.get('time'),
                'status': a.get('status'),
                'duration': a.get('duration'),
                'notes': a.get('notes')
            } for a in cons]
            return jsonify(formatted)

    # Doctor routes
    @app.get('/api/doctor/profile')
    @auth_required
    def doctor_profile():
        user_id = request.user['userId']
        if use_db:
            try:
                from bson import ObjectId
                doctor = db['doctors'].find_one({'_id': ObjectId(user_id)})
            except Exception:
                doctor = None
            if not doctor:
                return jsonify({'error': 'Doctor not found'}), 404
            safe = {k: v for k, v in doctor.items() if k != 'password'}
            safe['_id'] = str(doctor.get('_id'))
            safe.setdefault('specialty', 'General Physician')
            return jsonify(safe)
        else:
            doctor = next((u for u in users['doctor'].values() if u['_id'] == user_id), None)
            if not doctor:
                return jsonify({'error': 'Doctor not found'}), 404
            safe = {k: v for k, v in doctor.items() if k != 'password'}
            safe.setdefault('specialty', 'General Physician')
            return jsonify(safe)

    @app.get('/api/doctor/stats')
    @auth_required
    def doctor_stats():
        user_id = request.user['userId']
        today = now_utc().date()
        def is_today(date_str: str) -> bool:
            try:
                return datetime.fromisoformat(date_str.replace('Z','')).date() == today
            except Exception:
                return False
        if use_db:
            today_appointments = db['appointments'].count_documents({'doctorId': user_id, 'status': 'scheduled'})
            waiting_patients = db['appointments'].count_documents({'doctorId': user_id, 'status': 'scheduled'})
            total_patients = len(set([a['patientId'] for a in db['appointments'].find({'doctorId': user_id}, {'patientId': 1})]))
            total_consultations = db['appointments'].count_documents({'doctorId': user_id, 'status': 'completed'})
        else:
            today_appointments = len([a for a in appointments if a.get('doctorId') == user_id and a.get('status') == 'scheduled' and a.get('date') and is_today(a['date'])])
            waiting_patients = len([a for a in appointments if a.get('doctorId') == user_id and a.get('status') == 'scheduled'])
            total_patients = len({a['patientId'] for a in appointments if a.get('doctorId') == user_id})
            total_consultations = len([a for a in appointments if a.get('doctorId') == user_id and a.get('status') == 'completed'])
        stats = [
            { 'label': "Today's Appointments", 'value': str(today_appointments), 'icon': 'Calendar', 'color': 'text-primary' },
            { 'label': 'Waiting Patients', 'value': str(waiting_patients), 'icon': 'Clock', 'color': 'text-warning' },
            { 'label': 'Total Patients', 'value': str(total_patients), 'icon': 'Users', 'color': 'text-secondary' },
            { 'label': 'Consultations', 'value': str(total_consultations), 'icon': 'Video', 'color': 'text-success' },
        ]
        return jsonify(stats)

    @app.get('/api/doctor/consultations/upcoming')
    @auth_required
    def doctor_upcoming_consultations():
        user_id = request.user['userId']
        today = now_utc().date()
        def is_today_or_future(date_str: str) -> bool:
            try:
                apt_date = datetime.fromisoformat(date_str.replace('Z','')).date()
                return apt_date >= today
            except Exception:
                return False
        if use_db:
            cons = list(db['appointments'].find({'doctorId': user_id, 'status': 'scheduled'}).sort('time', 1))
            formatted = []
            for a in cons:
                if not is_today_or_future(a.get('date', '')):
                    continue
                patient_name = a.get('patientName', 'Unknown Patient')
                if patient_name == 'Unknown Patient':
                    try:
                        from bson import ObjectId
                        patient = db['patients'].find_one({'_id': ObjectId(a.get('patientId'))})
                        if patient:
                            patient_name = patient.get('name', 'Unknown Patient')
                    except Exception:
                        pass
                formatted.append({
                    'id': str(a.get('_id')),
                    'patient': patient_name,
                    'patientId': a.get('patientId'),
                    'time': a.get('time'),
                    'type': a.get('type'),
                    'priority': a.get('priority'),
                    'duration': a.get('duration'),
                    'healthIssue': a.get('healthIssue', 'N/A')
                })
            return jsonify(formatted)
        else:
            cons = [a for a in appointments if a.get('doctorId') == user_id and a.get('status') == 'scheduled' and a.get('date') and is_today_or_future(a['date'])]
            cons.sort(key=lambda x: x.get('time') or '')
            formatted = []
            for a in cons:
                patient_name = a.get('patientName', 'Unknown Patient')
                if patient_name == 'Unknown Patient':
                    for email, patient in users['patient'].items():
                        if patient['_id'] == a.get('patientId'):
                            patient_name = patient.get('name', 'Unknown Patient')
                            break
                formatted.append({
                    'id': a['id'],
                    'patient': patient_name,
                    'patientId': a.get('patientId'),
                    'time': a.get('time'),
                    'type': a.get('type'),
                    'priority': a.get('priority'),
                    'duration': a.get('duration'),
                    'healthIssue': a.get('healthIssue', 'N/A')
                })
            return jsonify(formatted)

    @app.get('/api/doctor/patients/recent')
    @auth_required
    def doctor_recent_patients():
        user_id = request.user['userId']
        if use_db:
            cons = list(db['appointments'].find({'doctorId': user_id, 'status': 'completed'}).sort('date', -1))
            formatted = []
            seen = set()
            for a in cons:
                pid = a.get('patientId')
                if not pid or pid in seen:
                    continue
                seen.add(pid)
                formatted.append({
                    'id': pid,
                    'name': a.get('patientName', 'Unknown Patient'),
                    'lastVisit': a.get('date'),
                    'condition': 'N/A',
                    'age': 30
                })
                if len(formatted) >= 5:
                    break
            return jsonify(formatted)
        else:
            cons = [a for a in appointments if a.get('doctorId') == user_id and a.get('status') == 'completed']
            cons.sort(key=lambda x: x.get('date') or '', reverse=True)
            formatted = []
            seen = set()
            for a in cons:
                pid = a.get('patientId')
                if not pid or pid in seen:
                    continue
                seen.add(pid)
                formatted.append({
                    'id': pid,
                    'name': a.get('patientName', 'Unknown Patient'),
                    'lastVisit': a.get('date'),
                    'condition': 'N/A',
                    'age': 30
                })
                if len(formatted) >= 5:
                    break
            return jsonify(formatted)

    @app.get('/api/doctor/schedule')
    @auth_required
    def doctor_schedule():
        user_id = request.user['userId']
        if use_db:
            sched = list(db['appointments'].find({'doctorId': user_id, 'status': {'$ne': 'cancelled'}}).sort([('date', 1), ('time', 1)]))
            formatted = [{
                'id': str(a.get('_id')),
                'patientName': a.get('patientName', 'Unknown Patient'),
                'patientId': a.get('patientId'),
                'date': a.get('date'),
                'time': a.get('time'),
                'type': a.get('type'),
                'status': a.get('status'),
                'healthIssue': a.get('healthIssue', 'N/A')
            } for a in sched]
            return jsonify(formatted)
        else:
            sched = [a for a in appointments if a.get('doctorId') == user_id and a.get('status') != 'cancelled']
            sched.sort(key=lambda x: (x.get('date') or '', x.get('time') or ''))
            formatted = [{
                'id': a['id'],
                'patientName': a.get('patientName', 'Unknown Patient'),
                'patientId': a.get('patientId'),
                'date': a.get('date'),
                'time': a.get('time'),
                'type': a.get('type'),
                'status': a.get('status'),
                'healthIssue': a.get('healthIssue', 'N/A')
            } for a in sched]
            return jsonify(formatted)

    @app.get('/api/doctor/patients')
    @auth_required
    def doctor_patients():
        user_id = request.user['userId']
        if use_db:
            pts = {}
            for a in db['appointments'].find({'doctorId': user_id}):
                pid = a.get('patientId')
                if pid and pid not in pts:
                    # Try to get patient details from patients collection
                    try:
                        from bson import ObjectId
                        patient = db['patients'].find_one({'_id': ObjectId(pid)})
                        if patient:
                            pts[pid] = {
                                'id': pid,
                                'name': patient.get('name', a.get('patientName', 'Unknown Patient')),
                                'age': patient.get('age', 30),
                                'condition': 'N/A',
                                'phone': patient.get('phone', '0000000000'),
                                'email': patient.get('email', 'unknown@example.com'),
                                'lastVisit': a.get('date')
                            }
                        else:
                            pts[pid] = {
                                'id': pid,
                                'name': a.get('patientName', 'Unknown Patient'),
                                'age': 30,
                                'condition': 'N/A',
                                'phone': '0000000000',
                                'email': 'unknown@example.com',
                                'lastVisit': a.get('date')
                            }
                    except Exception:
                        pts[pid] = {
                            'id': pid,
                            'name': a.get('patientName', 'Unknown Patient'),
                            'age': 30,
                            'condition': 'N/A',
                            'phone': '0000000000',
                            'email': 'unknown@example.com',
                            'lastVisit': a.get('date')
                        }
            return jsonify(list(pts.values()))
        else:
            pts = {}
            for a in appointments:
                if a.get('doctorId') == user_id:
                    pid = a.get('patientId')
                    if pid and pid not in pts:
                        # Get patient name from users dict
                        patient_name = a.get('patientName', 'Unknown Patient')
                        for email, patient in users['patient'].items():
                            if patient['_id'] == pid:
                                patient_name = patient.get('name', patient_name)
                                break
                        pts[pid] = {
                            'id': pid,
                            'name': patient_name,
                            'age': 30,
                            'condition': 'N/A',
                            'phone': '0000000000',
                            'email': 'unknown@example.com',
                            'lastVisit': a.get('date')
                        }
            return jsonify(list(pts.values()))

    @app.get('/api/doctor/consultations')
    @auth_required
    def doctor_consultations():
        user_id = request.user['userId']
        cons = [a for a in appointments if a.get('doctorId') == user_id and a.get('status') == 'completed']
        cons.sort(key=lambda x: x.get('date') or '', reverse=True)
        formatted = [{
            'id': a['id'],
            'patientName': a.get('patientName', 'Unknown Patient'),
            'patientId': a.get('patientId'),
            'date': a.get('date'),
            'time': a.get('time'),
            'status': a.get('status'),
            'duration': a.get('duration'),
            'notes': a.get('notes')
        } for a in cons]
        return jsonify(formatted)

    @app.get('/api/doctor/prescriptions')
    @auth_required
    def doctor_prescriptions():
        user_id = request.user['userId']
        if use_db:
            presc = list(db['prescriptions'].find({'doctorId': user_id}).sort('date', -1))
            formatted = [{
                'id': str(p.get('_id')),
                'patientName': p.get('patientName', 'Unknown Patient'),
                'patientId': p.get('patientId'),
                'medication': (p.get('medications') or [{}])[0].get('name', 'N/A'),
                'dosage': (p.get('medications') or [{}])[0].get('dosage', ''),
                'date': p.get('date'),
                'duration': (p.get('medications') or [{}])[0].get('duration', '')
            } for p in presc]
            return jsonify(formatted)
        else:
            presc = [p for p in prescriptions if p.get('doctorId') == user_id]
            presc.sort(key=lambda x: x.get('date') or '', reverse=True)
            formatted = [{
                'id': p['id'],
                'patientName': p.get('patientName', 'Unknown Patient'),
                'patientId': p.get('patientId'),
                'medication': (p.get('medications') or [{}])[0].get('name', 'N/A'),
                'dosage': (p.get('medications') or [{}])[0].get('dosage', ''),
                'date': p.get('date'),
                'duration': (p.get('medications') or [{}])[0].get('duration', '')
            } for p in presc]
            return jsonify(formatted)

    @app.post('/api/doctor/prescriptions')
    @auth_required
    def doctor_create_prescription():
        body = request.get_json(force=True, silent=True) or {}
        if use_db:
            doc = {'doctorId': request.user['userId']}
            doc.update(body)
            result = db['prescriptions'].insert_one(doc)
            return jsonify({'message': 'Prescription created successfully', 'id': str(result.inserted_id)}), 201
        else:
            p = {
                'id': f"pr_{len(prescriptions)+1}",
                'doctorId': request.user['userId']
            }
            p.update(body)
            prescriptions.append(p)
            return jsonify({'message': 'Prescription created successfully', 'id': p['id']}), 201

    @app.get('/api/doctor/messages')
    @auth_required
    def doctor_messages():
        return jsonify([])

    # Get all doctors for appointment booking
    @app.get('/api/doctors')
    @auth_required
    def get_all_doctors():
        if use_db:
            doctors = list(db['doctors'].find({}, {'password': 0}).sort('name', 1))
            for d in doctors:
                d['id'] = str(d.get('_id'))
                d.pop('_id', None)
            return jsonify(doctors)
        else:
            doctors = []
            for email, doctor in users['doctor'].items():
                safe_doctor = {k: v for k, v in doctor.items() if k != 'password'}
                safe_doctor['id'] = doctor['_id']
                safe_doctor['email'] = email
                doctors.append(safe_doctor)
            return jsonify(sorted(doctors, key=lambda x: x.get('name', '')))

    # Get doctor's available slots for a week
    @app.get('/api/doctors/<doctor_id>/availability')
    @auth_required
    def get_doctor_availability(doctor_id):
        # Get all appointments for this doctor
        if use_db:
            booked = list(db['appointments'].find({'doctorId': doctor_id, 'status': 'scheduled'}))
        else:
            booked = [a for a in appointments if a.get('doctorId') == doctor_id and a.get('status') == 'scheduled']
        
        # Create booked slots map
        booked_slots = {}
        for apt in booked:
            date_str = apt.get('date', '')[:10] if apt.get('date') else ''
            time_str = apt.get('time', '')
            if date_str and time_str:
                key = f"{date_str}_{time_str}"
                booked_slots[key] = True
        
        return jsonify({'bookedSlots': booked_slots})

    @app.route('/api/patient/appointments/<appointment_id>/cancel', methods=['POST', 'PUT'])
    @auth_required
    def cancel_appointment(appointment_id):
        user_id = request.user['userId']
        if use_db:
            try:
                from bson import ObjectId
                result = db['appointments'].update_one(
                    {'$or': [{'_id': ObjectId(appointment_id)}, {'id': appointment_id}], 'patientId': user_id},
                    {'$set': {'status': 'cancelled'}}
                )
                if result.matched_count == 0:
                    return jsonify({'error': 'Appointment not found'}), 404
                return jsonify({'message': 'Appointment cancelled successfully'})
            except Exception as e:
                result = db['appointments'].update_one(
                    {'id': appointment_id, 'patientId': user_id},
                    {'$set': {'status': 'cancelled'}}
                )
                if result.matched_count == 0:
                    return jsonify({'error': 'Appointment not found'}), 404
                return jsonify({'message': 'Appointment cancelled successfully'})
        else:
            apt = next((a for a in appointments if a['id'] == appointment_id and a['patientId'] == user_id), None)
            if not apt:
                return jsonify({'error': 'Appointment not found'}), 404
            apt['status'] = 'cancelled'
            return jsonify({'message': 'Appointment cancelled successfully'})

    @app.route('/api/doctor/appointments/<appointment_id>', methods=['PUT'])
    @auth_required
    def doctor_update_appointment(appointment_id):
        user_id = request.user['userId']
        body = request.get_json(force=True, silent=True) or {}
        if use_db:
            try:
                from bson import ObjectId
                result = db['appointments'].update_one(
                    {'$or': [{'_id': ObjectId(appointment_id)}, {'id': appointment_id}], 'doctorId': user_id},
                    {'$set': body}
                )
                if result.matched_count == 0:
                    return jsonify({'error': 'Appointment not found'}), 404
                return jsonify({'message': 'Appointment updated successfully'})
            except Exception:
                result = db['appointments'].update_one(
                    {'id': appointment_id, 'doctorId': user_id},
                    {'$set': body}
                )
                if result.matched_count == 0:
                    return jsonify({'error': 'Appointment not found'}), 404
                return jsonify({'message': 'Appointment updated successfully'})
        else:
            apt = next((a for a in appointments if a['id'] == appointment_id and a['doctorId'] == user_id), None)
            if not apt:
                return jsonify({'error': 'Appointment not found'}), 404
            apt.update(body)
            return jsonify({'message': 'Appointment updated successfully'})

    @app.route('/api/doctor/appointments/<appointment_id>/cancel', methods=['POST'])
    @auth_required
    def doctor_cancel_appointment(appointment_id):
        user_id = request.user['userId']
        if use_db:
            try:
                from bson import ObjectId
                result = db['appointments'].update_one(
                    {'$or': [{'_id': ObjectId(appointment_id)}, {'id': appointment_id}], 'doctorId': user_id},
                    {'$set': {'status': 'cancelled'}}
                )
                if result.matched_count == 0:
                    return jsonify({'error': 'Appointment not found'}), 404
                return jsonify({'message': 'Appointment cancelled successfully'})
            except Exception:
                result = db['appointments'].update_one(
                    {'id': appointment_id, 'doctorId': user_id},
                    {'$set': {'status': 'cancelled'}}
                )
                if result.matched_count == 0:
                    return jsonify({'error': 'Appointment not found'}), 404
                return jsonify({'message': 'Appointment cancelled successfully'})
        else:
            apt = next((a for a in appointments if a['id'] == appointment_id and a['doctorId'] == user_id), None)
            if not apt:
                return jsonify({'error': 'Appointment not found'}), 404
            apt['status'] = 'cancelled'
            return jsonify({'message': 'Appointment cancelled successfully'})

    @app.post('/api/doctor/block-slot')
    @auth_required
    def doctor_block_slot():
        user_id = request.user['userId']
        body = request.get_json(force=True, silent=True) or {}
        if use_db:
            doc = {
                'doctorId': user_id,
                'patientName': 'Blocked',
                'type': 'Blocked',
                'status': 'blocked'
            }
            doc.update(body)
            result = db['appointments'].insert_one(doc)
            doc['id'] = str(result.inserted_id)
            return jsonify(doc), 201
        else:
            new_apt = {
                'id': f"apt_{len(appointments)+1}",
                'doctorId': user_id,
                'patientName': 'Blocked',
                'type': 'Blocked',
                'status': 'blocked'
            }
            new_apt.update(body)
            appointments.append(new_apt)
            return jsonify(new_apt), 201

    @app.post('/api/doctor/appointments/<appointment_id>/complete')
    @auth_required
    def doctor_complete_appointment(appointment_id):
        user_id = request.user['userId']
        if use_db:
            try:
                from bson import ObjectId
                result = db['appointments'].update_one(
                    {'$or': [{'_id': ObjectId(appointment_id)}, {'id': appointment_id}], 'doctorId': user_id},
                    {'$set': {'status': 'completed'}}
                )
                if result.matched_count == 0:
                    return jsonify({'error': 'Appointment not found'}), 404
                return jsonify({'message': 'Consultation marked as completed'})
            except Exception:
                result = db['appointments'].update_one(
                    {'id': appointment_id, 'doctorId': user_id},
                    {'$set': {'status': 'completed'}}
                )
                if result.matched_count == 0:
                    return jsonify({'error': 'Appointment not found'}), 404
                return jsonify({'message': 'Consultation marked as completed'})
        else:
            apt = next((a for a in appointments if a['id'] == appointment_id and a['doctorId'] == user_id), None)
            if not apt:
                return jsonify({'error': 'Appointment not found'}), 404
            apt['status'] = 'completed'
            return jsonify({'message': 'Consultation marked as completed'})

    return app


app = create_app()


if __name__ == '__main__':
    port = int(os.environ.get('PORT', '5000'))
    app.run(host='0.0.0.0', port=port)


