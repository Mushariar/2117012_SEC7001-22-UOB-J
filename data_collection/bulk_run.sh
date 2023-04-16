APPNAME=DISSERTATION
BASE=/Users/macbookpro/hdd/MSc/Dissertation/data/getdata
LOG=${BASE}/log
DATA=datafile
LOGFILE=${LOG}/${APPNAME}.process.log
LOCKFILE=${BASE}/pid.lock
GZFILES=${BASE}/rawdata

DONE=${BASE}/rawdata_done


cd ${BASE}

RETCODE=$?

if [ ${RETCODE} != "0" ]
then
	echo "[`date`] Base folder is missing, cannot start script"
	exit 1
fi

mkdir ${DATA} ${LOG} >/dev/null 2>&1

#time npm test
  
  for f in ${GZFILES}/*.gz
  do 
  {
    echo ${f}
    if gzip -t ${f};
      then :
      echo "$(basename "$f") is ok" >> ${LOGFILE}
      time npm start ${f} 
      #rm -f ${f}
      mv $f ${DONE}/
    else
      echo "$(basename "$f") is corrupt" >> ${LOGFILE}
      
      echo "$(basename "$f") re-downloading" >> ${LOGFILE}
      rm -f ${f}
      time npm stop ${f} 
      time npm start ${f} 
      #rm -f ${f}
      mv $f ${DONE}/
    fi
  } 
  done