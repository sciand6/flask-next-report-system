# using base image
FROM python:3.7

# setting working dir inside container
WORKDIR /main

# adding run.py to workdir
ADD run.py .

# adding requirements.txt to workdir
ADD requirements.txt .

# installing flask requirements
RUN pip install -r requirements.txt

# adding in all contents from flaskapp folder into a new flaskapp folder
ADD ./flaskapp ./flaskapp

# exposing port 8000 on container
EXPOSE 8000

# serving flask backend through uWSGI server
CMD [ "python", "run.py" ]