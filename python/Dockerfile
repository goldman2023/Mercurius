FROM python:3.8.5
WORKDIR /app
ENV FLASK_APP=Schedule_Generate.py
COPY requirement* requirement.txt
#RUN pip --no-cache-dir install torch==1.7.1
RUN apt update
RUN apt install -y python3-gpg
RUN pip install -r requirement.txt  --no-cache-dir
RUN curl -fsSLO https://get.docker.com/builds/Linux/x86_64/docker-17.04.0-ce.tgz \
  && tar xzvf docker-17.04.0-ce.tgz \
  && mv docker/docker /usr/local/bin \
  && rm -r docker docker-17.04.0-ce.tgz
COPY . .
EXPOSE 5000
CMD ["python","Schedule_Generate.py"]
