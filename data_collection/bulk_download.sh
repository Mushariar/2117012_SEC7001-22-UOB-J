APPNAME=DISSERTATION
BASE=/Users/macbookpro/hdd/MSc/Dissertation/data/getdata
LOG=${BASE}/log
DATA=datafile
LOGFILE=${LOG}/${APPNAME}.process.log
LOCKFILE=${BASE}/pid.lock
GZFILES=${BASE}/rawdata

cd ${BASE}

RETCODE=$?

if [ ${RETCODE} != "0" ]
then
	echo "[`date`] Base folder is missing, cannot start script"
	exit 1
fi

mkdir ${DATA} ${LOG} >/dev/null 2>&1

time npm test
  
  
done