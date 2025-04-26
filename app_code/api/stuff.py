from flask import Flask, Response

app = Flask(__name__)


@app.route("/")
def stuff():
    return Response("From Vercel stuff", mimetype="text/plain")



"""
@app.route("/thing")
def thing():
    return Response("From Vercel thing", mimetype="text/plain")
"""






