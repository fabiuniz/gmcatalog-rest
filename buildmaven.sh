#apt install openjdk-17-jdk
#java -version



#nano ~/.bashrc
#export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
#export PATH=$PATH:$JAVA_HOME/bin

#export MAVEN_HOME=/opt/maven
#export PATH=$PATH:$MAVEN_HOME/bin


#source ~/.bashrc

#mvn --version

#apt install maven
#mvn clean install


#mvn spring-boot:run

clear; mvn clean install ; mvn spring-boot:run
#docker-compose up -d
#http://vmlinuxd:8080/h2-console
#http://vmlinuxd:8080/swagger-ui/index.html
#http://vmlinuxd:8080
#http://vmlinuxd:5050/ pgamin
#
#apt-get install ufw
#ufw status
#ufw enable
#ufw status verbose
#ufw allow 5050/tcp
#ufw allow 5433/tcp
#ufw status verbose
#ufw reload
#docker logs dev-pgadmin
#chmod -R 777 dslist-rest/
#
#nano ~/.bashrc
#export JAVA_HOME="/usr/lib/jvm/zulu21.42.19-ca-fx-jdk21.0.7-linux_x64"
#export PATH=$PATH:$JAVA_HOME/bin
#export MAVEN_HOME=/opt/maven
#export PATH=$PATH:$MAVEN_HOME/bin
#update-alternatives --config java
#update-alternatives --config javac
#update-alternatives --install /usr/bin/javac javac /usr/lib/jvm/zulu21.42.19-ca-fx-jdk21.0.7-linux_x64/bin/javac 1
#
#cd /usr/lib/jvm/
#tar -xvzf /home/userlnx/docker/script_docker/relay/zulu21.42.19-ca-fx-jdk21.0.7-linux_x64.tar.gz