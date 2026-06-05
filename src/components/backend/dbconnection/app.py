from database_service import app
from auth import activate_account, register,user_status,select_plan,start_trial, login, logout, reset_password_request, update_password, forgot_password, reset_password 

@app.route('/activate/<token>', methods=['GET'])
def activate_account_user(token):
    return activate_account(token)

@app.route("/register", methods=["POST"])
def register_user():
    return register()
       
@app.route("/api/user/status", methods=["GET"])
def user_status_user():
    return user_status()

@app.route("/api/subscription/select-plan", methods=["POST"])
def select_plan_user():
    return select_plan()

@app.route("/api/subscription/start-trial", methods=["POST"])
def start_trial_user():
    return start_trial()

@app.route("/login", methods=["POST"])
def login_user():
    return login()
    
@app.after_request
def apply_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "http://localhost:3000"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization"
    response.headers["Access-Control-Allow-Methods"] = "GET,POST,OPTIONS"
    return response

@app.route("/reset-password-request", methods=["POST"])
def reset_password_request_user():
    return reset_password_request()
    
@app.route("/update-password", methods=["POST"])
def update_password_user():
    return update_password()

@app.route("/logout", methods=["POST"])
def logout_user():
    return logout()

@app.route("/forgot-password", methods=["POST", "OPTIONS"])
def forgot_password_user():
    return forgot_password()
                
@app.route("/reset-password", methods=["POST"])
def reset_password_user():
    return reset_password()


if __name__ == "__main__":
    app.run(debug=True)
