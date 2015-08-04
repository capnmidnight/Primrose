read -e -p "view old log file? " -i "Y" choice
if [ $choice = "Y" ]; then
    less ~/.forever/PrimroseServer.log
fi

forever stop "PrimroseServer"

read -e -p "delete old log file? " -i "N" choice
if [ $choice != "N" ]; then
    rm ~/.forever/PrimroseServer.log
fi
cd ..
git pull
cd bin
forever --uid "PrimroseServer" -a start /usr/local/bin/npm start
