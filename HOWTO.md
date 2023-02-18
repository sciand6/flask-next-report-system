# This repo follows this tutorial:
https://medium.com/swlh/build-and-deploy-a-web-app-with-react-flask-nginx-postgresql-docker-and-google-kubernetes-341f3b4de322

## The rest of this file is miscellaneous references such as commands, articles and code blocks

# How to kill nginx on Windows
taskkill /f /IM nginx.exe

# How to get requirements.txt
pip freeze > requirements.txt

Make sure you're venv is activated or this will get all the python packages on your
local machine.

# Check Kubernetes Logs
kubectl get deployment flask
kubectl describe pod <pod-name>