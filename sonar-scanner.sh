#!/bin/bash

rm -fr reports
npm test && /opt/sonar-scanner/bin/sonar-scanner && firefox http://localhost:9001
