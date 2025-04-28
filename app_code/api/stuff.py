from flask import Flask, Response
from werkzeug.middleware.dispatcher import DispatcherMiddleware
from werkzeug.wrappers import Response as WsgiResponse


flask_app = Flask(__name__)


@flask_app.route("/")
def stuff():
    return Response("STUFF", mimetype="text/plain")


@flask_app.route("/thing")
def thing():
    return Response("THING", mimetype="text/plain")


app = DispatcherMiddleware(
    WsgiResponse("Not Found", status=404), {"/api/stuff": flask_app}
)
