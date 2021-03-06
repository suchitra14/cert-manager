#!/bin/bash

###############################################################################
#
# Test script
#
# Environment Variable Prerequisites
#
#   AXON_HOME       Directory with untarred and unziped axon distribution.
#                   Generally contents would include - bin, logs and conf
#
# System wide defaults like the JAVA_HOME, JAVA_OPTS are to be best handled
# in the .bashrc/.profile or /etc/environment based on the use case.
#
# Author: Suchitra
#
###############################################################################

# This can be a script in itself, here, I have just assumed that we have
# a place holder.

cn=$1
ou=$2
echo "The cn received is "$cn
echo "The ou received is "$ou
c=`cat certs.txt | grep 'Udaya*'`
echo "The result is "$c