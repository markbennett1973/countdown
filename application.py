from flask import Flask, jsonify, render_template, request
import solver
import panzi_solver


# configure application
app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/letters")
def letters():
    return render_template("letters.html")


@app.route("/numbers")
def numbers():
    return render_template("numbers.html")


@app.route("/letters/solve")
def letters_solve():
    if request.args.get("letters"):
        best_word = solver.solve_letters(request.args.get("letters"))
        return jsonify(best_word)

    response = jsonify("No letters specified")
    response.status_code = 400
    return response


@app.route("/letters/check")
def check_word():
    if request.args.get("word") and request.args.get("letters"):
        valid = solver.check_word(request.args.get("word"), request.args.get("letters"))
        return jsonify(valid)

    response = jsonify("No word specified")
    response.status_code = 400
    return response


@app.route("/numbers/solve")
def numbers_solve():
    if request.args.get("numbers") and request.args.get("target"):
        # TODO: update my solver with postfix calculations to handle brackets. In the meantime, use the
        # solver by Mathias Panzenböck - https://github.com/panzi/numbers-python
        # solution = solver.solve_numbers(request.args.get("numbers"), request.args.get("target"))
        solution = panzi_solver.solve_numbers(request.args.get("numbers"), request.args.get("target"))
        return jsonify(solution)
    else:
        response = jsonify("No numbers specified")
        response.status_code = 400
        return response