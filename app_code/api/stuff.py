from flask import Flask, Response
from werkzeug.middleware.dispatcher import DispatcherMiddleware
from werkzeug.wrappers import Response as WsgiResponse


flask_app = Flask(__name__)


@flask_app.route("/")
def stuff():
    return Response("From Vercel stuff", mimetype="text/plain")


@flask_app.route("/thing")
def thing():
    return Response("From Vercel thing", mimetype="text/plain")


app = DispatcherMiddleware(
    WsgiResponse("Not Found", status=404), {"/api/stuff": flask_app}
)
