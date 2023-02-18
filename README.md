# How to set up the React (Nextjs)/Flask reverse proxy with NGINX and deploy to Google Kubernetes Engine

## 1. Create the Dockerfile for Flask
This Dockerfile is located in the main folder. It's the first Dockerfile you'll see when you open up the repository.
## 2. Create the Dockerfile for NextJs/React
This Dockerfile will be located in the nextapp folder.

<li>
Normally you would test these locally using docker-compose, but I'm going to skip that step since I already tested them. We'll be using these Dockerfiles later.
</li>

## 3. Create cloudbuild.yaml
This file is located in the main folder.

## 4. Create services version of deployment.yaml
```
apiVersion: v1
kind: Service
metadata:
  name: ui
spec:
  type: LoadBalancer
  selector:
    app: next
    tier: ui
  ports:
    - port: 8080
      targetPort: 8080
---
apiVersion: v1
kind: Service
metadata: 
  name: flask
spec:
  type: ClusterIP
  selector:
    component: flask
  ports:
    - port: 8000
      targetPort: 8000
```

This is the first version of deployment.yaml. There will be a second version we'll call the deployment version of deployment.yaml. For now just understand that this is the services version of deployment.yaml.

## 5. Create Google Cloud Project and Enable Billing
Create a google cloud project, make a billing account and enable billing for the project

## 6. Install the Google Cloud SDK/CLI
https://cloud.google.com/sdk/docs/install-sdk

## 7. Login to Google Cloud in the Command Line
```
gcloud auth list
gcloud auth login
```

## 8. Create Google Kubernetes Cluster
+Enable Kubernetes Engine API<br>
-Click create cluster, click configure on standard (not autopilot)

+Cluster basics:<br>
-Cluster name: flask-react-report-system - Put this in cloudbuild.yaml<br>
-Location (Zonal): us-east4-b - Put this in cloudbuild.yaml<br>
-Control Plane Version: static version

+default-pool:<br>
-Series - n1<br>
-Machine - n1-standard-2

Now click Create.

## 9. Enable Cloud Build API
This is needed to submit cloudbuild.yaml.

## 10. Submit cloudbuild.yaml with services version of deployment.yaml
Run this command:

```
gcloud builds submit --project=frrs-378218 --config cloudbuild.yaml
```

This will submit our first (services) version of deployment.yaml that we created and put in the main project folder alongside cloudbuild.yaml. It might take a bit.

If you get 

```
Error: failed to apply deployment: failed to get access to cluster: failed to authorize access: command to get cluster credentials failed: exit status 1
```

Go to IAM and grant necessary permissions to the service accounts (gserviceaccount) such as (Storage Admin, Cloud Build Admin etc.). I'm just going to make them all Owner to simplify this process.

Once this is done go to Services and Ingress and verify that both services are there.

## 11. Change the React/Next App API calls to use the External load balancer's IP
The IP I have to use when I'm debugging React is localhost:8000 because I have flask running on that port. However the IP I'm referring to here is localhost:8080 which is what I use for local NGINX in my nextapp and if I'm deploying to GCP I have to change that to the external load balancer's IP 8080.

## 12. Create the nginx.conf File
This will be the configuraton file used to deploy to GCP. It's located in the nextapp folder. Make the proxy_pass http://flask:8000/ because the we only need the name of the ClusterIP its IP. Change the Access-Control-Allow-Origin IP to the Extended load balancer's IP.

## 13. Add this to app.py
```
@app.route('/health')
def health():
    return '', 200

@app.route('/ready')
def ready():
    return '', 200
```

This is for Kubernetes health and ready checks.

## 14. Create deployment version of deployment.yaml
```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: flask
spec:
  replicas: 1
  selector:
    matchLabels:
      component: flask
  template:
    metadata:
      labels:
        component: flask
    spec:
      containers:
        - name: flask
          image: gcr.io/frrs-378218/fssr-flask:latest
          imagePullPolicy: "Always"
          resources:
            limits:
              cpu: "1000m"
            requests:
              cpu: "400m"
          livenessProbe:
            httpGet:
              path: /health
              port: 8000
            initialDelaySeconds: 30
            periodSeconds: 5
          readinessProbe:
            httpGet:
              path: /ready
              port: 8000
            initialDelaySeconds: 30
            periodSeconds: 5
          ports:
            - containerPort: 8000
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ui
spec:
  replicas: 1
  selector:
    matchLabels:
      app: next
      tier: ui
  template:
    metadata:
      labels:
        app: next
        tier: ui
    spec:
      containers:
        - name: ui
          image: gcr.io/frrs-378218/fssr-nginx:latest
          imagePullPolicy: "Always"
          resources:
            limits:
              cpu: "1000m"
            requests:
              cpu: "400m"
          livenessProbe:
            httpGet:
              path: /health
              port: 8080
            initialDelaySeconds: 30
            periodSeconds: 5
          readinessProbe:
            httpGet:
              path: /ready
              port: 8080
            initialDelaySeconds: 30
            periodSeconds: 5
          ports:
            - containerPort: 8080
```

This is the second version of deployment.yaml, the deployment version. This will be used to deploy our Docker images to GCP after we build them in the next step. This version you could find in the main folder of the repository.

## 15. Build Docker Images
Run these commands:

```
docker build --no-cache -t gcr.io/frrs-378218/frrs-flask:latest .
docker build --no-cache -t gcr.io/frrs-378218/frrs-nginx:latest ./nextapp
docker push gcr.io/frrs-378218/frrs-flask:latest
docker push gcr.io/frrs-378218/frrs-nginx:latest
```

We can verify this in GCP’s Container Registry.

## 16. Submit cloudbuild.yaml with deployment version of deployment.yaml
Run this command:

```
gcloud builds submit --project=frrs-378218 --config cloudbuild.yaml
```

The app should be deployed and available at http://LoadBalancerIP:8080.

## TODO: Add deploying changes to GCP tutorial