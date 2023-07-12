FROM openjdk:13.0.2-jdk-slim
ADD STLinesSpringApi.jar app.jar
ENV JAVA_OPTS=""
# ENV DISPLAY=0.0
# RUN apt-get update
#RUN apt install -y libxext6
# RUN apt-get -y install libxrender1 libxtst6 libxi6
EXPOSE 2020
ENTRYPOINT exec java $JAVA_OPTS -jar app.jar
