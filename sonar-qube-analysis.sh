#!/bin/bash

sonar-scanner\
 -Dsonar.projectKey=LectureDeNotes\
 -Dsonar.sources=./public\
 -Dsonar.host.url=http://localhost:9000\
 -Dsonar.login=a6d2f515115fbb79b42d7716755cfce18502f782
